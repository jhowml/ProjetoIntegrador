import type { Pedido } from '@prisma/client';
import { z } from 'zod';
import { createPedidoSchema } from './create-pedido.dto';

export type CreatePedidoDTO = z.infer<typeof createPedidoSchema>;
export type CreatePedidoResult = Pedido;
