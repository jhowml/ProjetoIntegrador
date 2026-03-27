import { z } from 'zod';

export const createMarmitaSchema = z.object({
  descricao: z.string().min(1).max(255),
  precoBase: z.number().positive(),
  adicionalEmbalagem: z.number().min(0).max(0.99),
  peso: z.number().positive(),
});
