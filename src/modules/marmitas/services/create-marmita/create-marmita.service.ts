import { CreateMarmitaDTO } from '@/modules/marmitas/dtos/create-marmita/create-marmita.types';
import { createMarmita as createMarmitaRepository } from '@/modules/marmitas/repositories/marmita.repository';

export async function createMarmita(data: CreateMarmitaDTO) {
  return createMarmitaRepository(data);
}
