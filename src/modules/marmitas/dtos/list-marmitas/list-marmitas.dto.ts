import { z } from 'zod';

export const listMarmitasSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  search: z.string().optional(),
});

export type ListMarmitasDTO = z.infer<typeof listMarmitasSchema>;
