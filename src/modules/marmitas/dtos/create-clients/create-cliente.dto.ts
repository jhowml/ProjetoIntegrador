import { z } from 'zod';

export const createClienteSchema = z.object({
  nome: z.string().min(1).max(255),
  endereco: z.string().min(1).max(255),
  telefone: z.string().min(10).max(12),
  obs: z.string().max(255).optional(),
});
