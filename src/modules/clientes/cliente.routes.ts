import { Router } from 'express';
import { listClientesController } from './controllers/list-clientes/list-clientes.controller';
import { createClienteController } from './controllers/create-cliente/create-cliente.controller';
import { updateClienteController } from './controllers/update-cliente/update-cliente.controller';
import { deleteClienteController } from './controllers/delete-cliente/delete-cliente.controller';

const router = Router();

router.get('/', listClientesController);
router.post('/', createClienteController);
router.put('/:id', updateClienteController);
router.delete('/:id', deleteClienteController);

export default router;
