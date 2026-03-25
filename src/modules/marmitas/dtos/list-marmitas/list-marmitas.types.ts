import { Marmita } from '@prisma/client';
import { PaginatedResult } from '../../../../shared/types/pagination';

export type ListMarmitasResult = PaginatedResult<Marmita>;
