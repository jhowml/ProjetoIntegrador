import { z } from 'zod';

export const updateClienteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateClienteBodySchema = z.object({
  nome: z.string().min(1).max(255).optional(),
  endereco: z.string().min(1).max(255).optional(),
  telefone: z.string().min(10).max(12).optional(),
  obs: z.string().max(255).optional(),
}).refine((body) => Object.keys(body).length > 0, {
  message: 'At least one field must be provided for update.',
});
