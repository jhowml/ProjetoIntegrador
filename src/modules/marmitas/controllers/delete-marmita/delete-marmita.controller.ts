import { NextFunction, Request, Response } from 'express';
import { deleteMarmitaParamsSchema } from '../../dtos/delete-marmita/delete-marmita.dto';
import { deleteMarmita } from '../../services/delete-marmita/delete-marmita.service';

export async function deleteMarmitaController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = deleteMarmitaParamsSchema.parse(req.params);
    await deleteMarmita(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
