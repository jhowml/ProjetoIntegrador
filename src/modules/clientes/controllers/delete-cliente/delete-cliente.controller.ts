import { NextFunction, Request, Response } from 'express';
import { deleteClienteParamsSchema } from '../../dtos/delete-cliente/delete-cliente.dto';
import { deleteCliente } from '@/composition/cliente-deletion';

export async function deleteClienteController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = deleteClienteParamsSchema.parse(req.params);
    await deleteCliente(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
