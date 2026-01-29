import 'dotenv/config'; // Carregar .env ANTES de tudo
import app from './app';
import { env } from './config/env';
import { logger } from './lib/logger';

app.listen(env.PORT, () => {
    logger.info(`Server started`, {
        port: env.PORT,
        environment: env.NODE_ENV,
        database: env.DATABASE_URL
    });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
    process.exit(1);
});