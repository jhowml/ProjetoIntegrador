import { z } from 'zod';
import { deleteClienteParamsSchema } from './delete-cliente.dto';

export type DeleteClienteParams = z.infer<typeof deleteClienteParamsSchema>;
