import { buildPaginatedResult } from '../../../../shared/types/pagination';
import { ListMarmitasDTO } from '../../dtos/list-marmitas/list-marmitas.dto';
import { listMarmitas as listMarmitasRepository } from '../../repositories/marmita.repository';

export async function listMarmitas(query: ListMarmitasDTO) {
  const { data, total } = await listMarmitasRepository(query);
  return buildPaginatedResult(data, total, query.page, query.limit);
}
