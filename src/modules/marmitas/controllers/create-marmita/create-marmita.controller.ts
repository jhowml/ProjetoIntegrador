import { NextFunction, Request, Response } from 'express';
import { createMarmitaSchema } from '../../dtos/create-marmita/create-marmita.dto';
import { createMarmita } from '../../services/create-marmita/create-marmita.service';

export async function createMarmitaController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createMarmitaSchema.parse(req.body);
    const result = await createMarmita(body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
