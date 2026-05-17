import { z } from 'zod';
import { Cliente } from '@prisma/client';
import { updateClienteParamsSchema, updateClienteBodySchema } from './update-cliente.dto';

export type UpdateClienteParams = z.infer<typeof updateClienteParamsSchema>;
export type UpdateClienteBodyDTO = z.infer<typeof updateClienteBodySchema>;
export type UpdateClienteResult = Cliente;
