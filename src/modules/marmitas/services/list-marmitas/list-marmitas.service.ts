import { buildPaginatedResult } from '@/shared/types/pagination';
import { ListMarmitasDTO } from '@/modules/marmitas/dtos/list-marmitas/list-marmitas.types';
import { listMarmitas as listMarmitasRepository } from '@/modules/marmitas/repositories/marmita.repository';

export async function listMarmitas(query: ListMarmitasDTO) {
  const { data, total } = await listMarmitasRepository(query);
  return buildPaginatedResult(data, total, query.page, query.limit);
}
