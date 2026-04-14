import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './config/logger';
import { errorHandler } from './shared/middleware/errorHandler.middleware';
import marmitaRoutes from './modules/marmitas/marmita.routes';
import clienteRoutes from './modules/clientes/cliente.routes';
import pedidoRoutes from './modules/pedidos/pedido.routes';

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/marmitas', marmitaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use(errorHandler);
export { app };
