import { NextFunction, Request, Response } from 'express';
import { listClienteSchema } from '../../dtos/list-clientes/list-clientes.dto';
import { listClientes } from '../../services/list-clientes/list-clientes.service';

export async function listClientesController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listClienteSchema.parse(req.query);
    const result = await listClientes(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
