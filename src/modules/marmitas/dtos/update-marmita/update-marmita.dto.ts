import { z } from 'zod';

export const updateMarmitaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateMarmitaBodySchema = z
  .object({
    descricao: z.string().min(1).max(255).optional(),
    precoBase: z.number().positive().optional(),
    adicionalEmbalagem: z.number().min(0).max(0.99).optional(),
    peso: z.number().positive().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field must be provided for update.',
  });
