import { Marmita } from '@prisma/client';
import { z } from 'zod';
import { PaginatedResult } from '@/shared/types/pagination';
import { listMarmitasSchema } from './list-marmitas.dto';

export type ListMarmitasDTO = z.infer<typeof listMarmitasSchema>;
export type ListMarmitasResult = PaginatedResult<Marmita>;
