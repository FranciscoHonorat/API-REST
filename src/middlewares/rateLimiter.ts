import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Rate limiter geral para toda a API
 */
export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter mais restritivo para operações de escrita
 */
export const strictLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: Math.floor(env.RATE_LIMIT_MAX_REQUESTS / 10),
    message: {
        status: 'error',
        message: 'Too many write operations, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});