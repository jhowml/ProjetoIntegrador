import { Router } from 'express';
import { listMarmitasController } from './controllers/list-marmitas/list-marmitas.controller';
import { createMarmitaController } from './controllers/create-marmita/create-marmita.controller';
import { updateMarmitaController } from './controllers/update-marmita/update-marmita.controller';
import { deleteMarmitaController } from './controllers/delete-marmita/delete-marmita.controller';

const router = Router();

router.get('/', listMarmitasController);
router.post('/', createMarmitaController);
router.put('/:id', updateMarmitaController);
router.delete('/:id', deleteMarmitaController);

export default router;
