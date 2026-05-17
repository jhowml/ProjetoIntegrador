import { z } from 'zod';
import { StatusPedido } from '@prisma/client';

const pedidoItemSchema = z.object({
  marmitaId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

export const updatePedidoParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updatePedidoBodySchema = z
  .object({
    clienteId: z.number().int().positive().optional(),
    itens: z.array(pedidoItemSchema).min(1).optional(),
    dataEntrega: z.union([z.coerce.date(), z.null()]).optional(),
    status: z.nativeEnum(StatusPedido).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field must be provided for update.',
  });
