import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errorHandler';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { logger } from '../lib/logger';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log do erro
    logger.error('Error Handler', {
        error: error.message,
        stack: env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.originalUrl,
        method: req.method
    });

    // Erros de validação Zod
    if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors,
            ...(env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }

    // Erro customizado da aplicação
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
            ...(env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }

    // Erros do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002': // Unique constraint
                const field = (error.meta?.target as string[])?.join(', ') || 'campo';
                return res.status(409).json({
                    status: 'error',
                    message: `${field} já existe`
                });
            
            case 'P2025': // Record not found
                return res.status(404).json({
                    status: 'error',
                    message: 'Registro não encontrado'
                });
            
            case 'P2003': // Foreign key constraint
                return res.status(400).json({
                    status: 'error',
                    message: 'Referência inválida. Verifique se os IDs existem.'
                });
            
            case 'P2014': // Required relation missing
                return res.status(400).json({
                    status: 'error',
                    message: 'Relacionamento obrigatório está faltando'
                });
            
            case 'P2011': // Null constraint
                const nullField = (error.meta?.target as string) || 'campo';
                return res.status(400).json({
                    status: 'error',
                    message: `${nullField} não pode ser nulo`
                });
            
            case 'P2016': // Query interpretation error
                return res.status(400).json({
                    status: 'error',
                    message: 'Consulta inválida'
                });
                
            default:
                // Em produção, não expor detalhes
                if (env.NODE_ENV === 'production') {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Erro no banco de dados'
                    });
                }
                
                // Em desenvolvimento, mostrar detalhes
                return res.status(500).json({
                    status: 'error',
                    message: error.message,
                    code: error.code,
                    meta: error.meta
                });
        }
    }

    // Erro de validação do Prisma
    if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            status: 'error',
            message: 'Dados inválidos',
            ...(env.NODE_ENV === 'development' && { details: error.message })
        });
    }

    // Erro de conexão com banco
    if (error instanceof Prisma.PrismaClientInitializationError) {
        logger.error('Database connection failed', { error: error.message });
        return res.status(503).json({
            status: 'error',
            message: 'Serviço temporariamente indisponível'
        });
    }

    // Erro genérico
    return res.status(500).json({
        status: 'error',
        message: env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message,
        ...(env.NODE_ENV === 'development' && { stack: error.stack })
    });
};