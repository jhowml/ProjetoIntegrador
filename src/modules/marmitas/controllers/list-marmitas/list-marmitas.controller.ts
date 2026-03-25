import { NextFunction, Request, Response } from 'express';
import { listMarmitasSchema } from '../../dtos/list-marmitas/list-marmitas.dto';
import { listMarmitas } from '../../services/list-marmitas/list-marmitas.service';

export async function listMarmitasController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listMarmitasSchema.parse(req.query);
    const result = await listMarmitas(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
