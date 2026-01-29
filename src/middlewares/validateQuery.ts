import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Estender o tipo Request para incluir validatedQuery
declare global {
    namespace Express {
        interface Request {
            validatedQuery?: any;
        }
    }
}

/**
 * Middleware para validar query parameters usando Zod
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Valida e transforma os query params
            const validated = schema.parse(req.query);
            
            // Armazena em req.validatedQuery ao invés de substituir req.query
            req.validatedQuery = validated;
            
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid query parameters',
                    errors: messages
                });
            }
            next(error);
        }
    };
};