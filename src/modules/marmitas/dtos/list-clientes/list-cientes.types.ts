import { Cliente } from '@prisma/client';
import { z } from 'zod';
import { PaginatedResult } from '@/shared/types/pagination';
import { listClienteSchema } from './list-clientes.dto';

export type ListClientesDTO = z.infer<typeof listClienteSchema>;
export type ListClientesResult = PaginatedResult<Cliente>;
