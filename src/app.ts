import express from 'express';
import cors from 'cors';
import healthRouter from './routes/healthRouter';
import courseRouter from './routes/courseRouter';
import studentRouter from './routes/studentRouter';
import { errorHandler } from './middlewares/erro';
import { notFoundHandler } from './middlewares/notFoundHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/health', healthRouter);
app.use('/courses', courseRouter);
app.use('/students', studentRouter);

// Middlewares de erro (sempre no final)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
