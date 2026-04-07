import { Router } from 'express';
import { listMarmitasController } from './controllers/list-marmitas/list-marmitas.controller';
import { createMarmitaController } from './controllers/create-marmita/create-marmita.controller';

const router = Router();

router.get('/', listMarmitasController);
router.post('/', createMarmitaController);

export default router;
