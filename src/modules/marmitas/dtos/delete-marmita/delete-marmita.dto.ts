import { z } from 'zod';

export const deleteMarmitaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const deleteMarmitaQuerySchema = z.object({
  force: z.preprocess((v) => v === 'true', z.boolean()).default(false),
});
