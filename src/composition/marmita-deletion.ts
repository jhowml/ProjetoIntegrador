import {
  findMarmitaById,
  countPedidosByMarmita,
  deleteMarmita as deleteMarmitaRepository,
} from '@/modules/marmitas/repositories/marmita.repository';
import { deleteMarmita as deleteMarmitaService } from '@/modules/marmitas/services/delete-marmita/delete-marmita.service';
import type { DeleteMarmitaPorts } from './marmita-deletion.ports';

const deleteMarmitaPorts: DeleteMarmitaPorts = {
  findMarmitaById,
  countPedidosByMarmita,
  deleteMarmita: deleteMarmitaRepository,
};

export async function deleteMarmita(id: number) {
  return deleteMarmitaService(id, deleteMarmitaPorts);
}
