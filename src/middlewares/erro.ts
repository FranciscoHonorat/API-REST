import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errorHandler';
import { Prisma } from '@prisma/client';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) =>  {
    console.error('Error: ', error);

    //Erro customizado da aplicação
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

      // Erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'Duplicate entry'
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Record not found'
      });
    }
  }

  // Erro genérico
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};