import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './config/logger';
import { env } from './config/env';
import { prisma } from './config/database';
import { errorHandler } from './shared/middleware/errorHandler.middleware';
import { authenticate } from './shared/middleware/auth.middleware';
import marmitaRoutes from './modules/marmitas/marmita.routes';
import clienteRoutes from './modules/clientes/cliente.routes';
import pedidoRoutes from './modules/pedidos/pedido.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import authRoutes from './modules/auth/auth.routes';

const app = express();
app.use(cors({ origin: env.ALLOWED_ORIGINS.split(',') }));
app.use(express.json());
app.use(pinoHttp({ logger }));
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'unreachable' });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/marmitas', authenticate, marmitaRoutes);
app.use('/api/clientes', authenticate, clienteRoutes);
app.use('/api/pedidos', authenticate, pedidoRoutes);
app.use(errorHandler);
export { app };
