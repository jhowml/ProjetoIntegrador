import { z } from 'zod';
import { StatusPedido } from '@prisma/client';

export const updatePedidoParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updatePedidoBodySchema = z
  .object({
    clienteId: z.number().int().positive().optional(),
    marmitaId: z.number().int().positive().optional(),
    quantidadeMarmitas: z.number().int().positive().optional(),
    dataEntrega: z.union([z.coerce.date(), z.null()]).optional(),
    status: z.nativeEnum(StatusPedido).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field must be provided for update.',
  });
