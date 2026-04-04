import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './config/logger';
import { errorHandler } from './shared/middleware/errorHandler.middleware';
import marmitaRoutes from './modules/marmitas/marmita.routes';

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', marmitaRoutes);
app.use(errorHandler);
export { app };
