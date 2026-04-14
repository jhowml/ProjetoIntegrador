import { NotFoundError } from '@/shared/errors/AppError';
import {
  findMarmitaById,
  deleteMarmita as deleteMarmitaRepository,
} from '@/modules/marmitas/repositories/marmita.repository';

export async function deleteMarmita(id: number) {
  const existing = await findMarmitaById(id);
  if (!existing) throw new NotFoundError('Marmita');

  await deleteMarmitaRepository(id);
}
