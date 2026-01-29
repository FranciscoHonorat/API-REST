import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    // Capturar quando a resposta terminar
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl, ip } = req;
        const { statusCode } = res;
        
        // Log level baseado no status code
        const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
        
        logger[level]('HTTP Request', {
            method,
            url: originalUrl,
            status: statusCode,
            duration: `${duration}ms`,
            ip: ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent')
        });
    });
    
    next();
};