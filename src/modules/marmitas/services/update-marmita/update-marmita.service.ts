import { NotFoundError } from '@/shared/errors/AppError';
import {
  findMarmitaById,
  updateMarmita as updateMarmitaRepository,
} from '@/modules/marmitas/repositories/marmita.repository';
import { UpdateMarmitaBodyDTO } from '@/modules/marmitas/dtos/update-marmita/update-marmita.types';

export async function updateMarmita(id: number, data: UpdateMarmitaBodyDTO) {
  const existing = await findMarmitaById(id);
  if (!existing) throw new NotFoundError('Marmita');

  return updateMarmitaRepository(id, data);
}
