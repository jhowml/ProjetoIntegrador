import { Router } from 'express';
import { createPedidoController } from './controllers/create-pedido/create-pedido.controller';

const router = Router();

router.post('/', createPedidoController);

export default router;
