import { NextFunction, Request, Response } from 'express';
import {
  updateMarmitaParamsSchema,
  updateMarmitaBodySchema,
} from '../../dtos/update-marmita/update-marmita.dto';
import { updateMarmita } from '../../services/update-marmita/update-marmita.service';

export async function updateMarmitaController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = updateMarmitaParamsSchema.parse(req.params);
    const body = updateMarmitaBodySchema.parse(req.body);
    const updated = await updateMarmita(id, body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
