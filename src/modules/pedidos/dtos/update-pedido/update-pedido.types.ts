import { z } from 'zod';
import type { Pedido } from '@prisma/client';
import { updatePedidoParamsSchema, updatePedidoBodySchema } from './update-pedido.dto';

export type UpdatePedidoParams = z.infer<typeof updatePedidoParamsSchema>;
export type UpdatePedidoBodyDTO = z.infer<typeof updatePedidoBodySchema>;
export type UpdatePedidoResult = Pedido;
