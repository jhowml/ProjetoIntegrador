import { z } from 'zod';

export const createPedidoSchema = z.object({
  clienteId: z.number().int().positive(),
  marmitaId: z.number().int().positive(),
  quantidadeMarmitas: z.number().int().positive(),
  dataEntrega: z.coerce.date().optional(),
});
