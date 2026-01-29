import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/erro';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { requestLogger } from './middlewares/requestLogger';
import { apiLimiter } from './middlewares/rateLimiter';
import studentRouter from './routes/studentRouter';
import courseRouter from './routes/courseRouter';
import enrollmentRouter from './routes/enrollmentRouter';
import healthRouter from './routes/healthRouter';

const app = express();

// Segurança - Headers
app.use(helmet());

// Segurança - CORS
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
app.use(cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Logging
app.use(requestLogger);

// Rate limiting
app.use(apiLimiter);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Student Management API Docs',
}));

// Rota para JSON do Swagger
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Rotas
app.use('/health', healthRouter);
app.use('/students', studentRouter);
app.use('/courses', courseRouter);
app.use('/enrollments', enrollmentRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
