import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware de validação usando Zod
 * Valida o body da requisição contra um schema Zod
 * 
 * @param schema - Schema Zod para validação
 * @returns Middleware Express
 * 
 * @example
 * router.post('/', validate(createStudentSchema), controller.create);
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Valida e transforma o body da requisição
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Formata os erros do Zod de forma legível
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.') || 'root',
                    message: issue.message
                }));
                
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors
                });
            }
            // Passa outros erros para o error handler global
            next(error);
        }
    };
};
