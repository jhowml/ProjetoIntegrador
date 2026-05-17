import { z } from 'zod';

const pedidoItemSchema = z.object({
  marmitaId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

export const createPedidoSchema = z.object({
  clienteId: z.number().int().positive(),
  itens: z.array(pedidoItemSchema).min(1),
  dataEntrega: z.coerce.date().optional(),
});
