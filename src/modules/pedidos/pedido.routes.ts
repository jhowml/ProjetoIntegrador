import { Router } from 'express';
import { listPedidosController } from './controllers/list-pedidos/list-pedidos.controller';
import { createPedidoController } from './controllers/create-pedido/create-pedido.controller';
import { updatePedidoController } from './controllers/update-pedido/update-pedido.controller';
import { deletePedidoController } from './controllers/delete-pedido/delete-pedido.controller';

const router = Router();

router.get('/', listPedidosController);
router.post('/', createPedidoController);
router.put('/:id', updatePedidoController);
router.delete('/:id', deletePedidoController);

export default router;
