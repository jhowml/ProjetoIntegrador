import { z } from 'zod';

export const deletePedidoParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
