import { Router } from 'express';
import { listMarmitasController } from './controllers/list-marmitas/list-marmitas.controller';
import { createMarmitaController } from './controllers/create-marmita/create-marmita.controller';
import { createClienteController } from './controllers/create-clients/create-clientes.controller';

const router = Router();

router.get('/marmitas', listMarmitasController);
router.post('/marmitas', createMarmitaController);
router.post('/clientes', createClienteController)

export default router;
