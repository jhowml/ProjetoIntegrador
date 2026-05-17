import { z } from 'zod';

export const listClienteSchema = z.object({
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().max(100).default(20),
  search: z.string().optional(),
});
