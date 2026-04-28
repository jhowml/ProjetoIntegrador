import { z } from 'zod';
import { StatusPedido } from '@prisma/client';

export const listPedidosSchema = z.object({
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().max(100).default(20),
  status: z.nativeEnum(StatusPedido).optional(),
  clienteId: z.coerce.number().int().positive().optional(),
  marmitaId: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
});
