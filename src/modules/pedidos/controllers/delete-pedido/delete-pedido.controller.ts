import { NextFunction, Request, Response } from 'express';
import { deletePedidoParamsSchema } from '../../dtos/delete-pedido/delete-pedido.dto';
import { deletePedido } from '@/composition/pedido-deletion';

export async function deletePedidoController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = deletePedidoParamsSchema.parse(req.params);
    await deletePedido(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
