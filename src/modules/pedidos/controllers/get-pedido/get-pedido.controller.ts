import { NextFunction, Request, Response } from 'express';
import { getPedidoParamsSchema } from '../../dtos/get-pedido/get-pedido.dto';
import { findPedidoById } from '../../repositories/pedido.repository';
import { NotFoundError } from '@/shared/errors/AppError';

export async function getPedidoController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = getPedidoParamsSchema.parse(req.params);
    const pedido = await findPedidoById(id);
    if (!pedido) throw new NotFoundError('Pedido');
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}
