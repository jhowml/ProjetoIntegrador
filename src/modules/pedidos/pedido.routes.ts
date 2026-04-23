import { Router } from 'express';
import { createPedidoController } from './controllers/create-pedido/create-pedido.controller';
import { updatePedidoController } from './controllers/update-pedido/update-pedido.controller';
import { deletePedidoController } from './controllers/delete-pedido/delete-pedido.controller';

const router = Router();

router.post('/', createPedidoController);
router.put('/:id', updatePedidoController);
router.delete('/:id', deletePedidoController);

export default router;
