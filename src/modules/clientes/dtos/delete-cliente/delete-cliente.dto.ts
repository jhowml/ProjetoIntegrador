import { z } from 'zod';

export const deleteClienteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const deleteClienteQuerySchema = z.object({
  force: z.preprocess((v) => v === 'true', z.boolean()).default(false),
});
