import winston from 'winston';
import { env } from '../config/env';

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
};

winston.addColors(logColors);

// Formato para console (development)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaStr = '';
        if (Object.keys(meta).length > 0) {
            metaStr = `\n${JSON.stringify(meta, null, 2)}`;
        }
        return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
);

// Formato para arquivo (production)
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Criar transports
const transports: winston.transport[] = [
    // Console (sempre ativo)
    new winston.transports.Console({
        format: consoleFormat
    })
];

// Adicionar arquivos em produção
if (env.NODE_ENV === 'production') {
    transports.push(
        // Arquivo de erros
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Arquivo combinado
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: fileFormat,
            maxsize: 5242880,
            maxFiles: 5
        })
    );
}

// Criar logger
export const logger = winston.createLogger({
    levels: logLevels,
    level: env.LOG_LEVEL,
    transports,
    // Não sair em caso de erro
    exitOnError: false
});

// Stream para Morgan (futuro)
export const loggerStream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};