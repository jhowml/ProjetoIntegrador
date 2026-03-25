import { Router } from 'express';
import { listMarmitasController } from './controllers/list-marmitas/list-marmitas.controller';

const router = Router();

router.get('/', listMarmitasController);

export default router;
