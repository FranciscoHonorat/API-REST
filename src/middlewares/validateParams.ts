import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar que o ID no path param é um número válido
 */
export const validateId = (paramName: string = 'id') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params[paramName], 10);
        
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: `Invalid ${paramName}. Must be a positive integer.`
            });
        }
        
        // Substituir por número parseado
        req.params[paramName] = id.toString();
        next();
    };
};

/**
 * Middleware para validar múltiplos IDs
 */
export const validateIds = (...paramNames: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const invalidParams: string[] = [];
        
        for (const paramName of paramNames) {
            const value = req.params[paramName];
            if (value !== undefined) {
                const id = parseInt(value, 10);
                if (isNaN(id) || id < 1) {
                    invalidParams.push(paramName);
                } else {
                    req.params[paramName] = id.toString();
                }
            }
        }
        
        if (invalidParams.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Invalid parameters: ${invalidParams.join(', ')}. Must be positive integers.`
            });
        }
        
        next();
    };
};