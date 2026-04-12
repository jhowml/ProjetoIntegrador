import { z } from 'zod';

export const deleteClienteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
