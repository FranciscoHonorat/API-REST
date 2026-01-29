import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar que o ID no path params é um número válido
 */

export const validateId = (paramName: string = 'id') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params[paramName], 10);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                status: 'error',
                message: `Invalido ${paramName}. `
            });
        }

        //Substitui por número parseado
        req.params[paramName] = id.toString();
        next();
    };
};

/**
 * Middleware para validar múltiplos IDs
 */

export const validateIds = (paramName: string = 'ids') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const invalidParams: string[] = [];

        for (const paramName of paramNames) {
            const value = req.params[paramName];
            if (value !-- undefined) {
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
                message: `Invalido parametros: ${invalidParams.join(', ')}. `
            });
        }

        next();
    };
};