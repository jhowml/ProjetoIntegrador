import { z } from 'zod';
import { createClienteSchema } from './create-cliente.dto';
import { Cliente } from '.prisma/client/wasm';

export type CreateClienteDTO = z.infer<typeof createClienteSchema>;
export type CreateClienteResult = Cliente;
