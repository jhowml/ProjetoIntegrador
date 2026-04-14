import { z } from 'zod';

export const deleteMarmitaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
