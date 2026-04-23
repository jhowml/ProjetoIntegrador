import { ConflictError, NotFoundError } from '@/shared/errors/AppError';
import type { DeleteMarmitaPorts } from '@/composition/marmita-deletion.ports';

export async function deleteMarmita(id: number, ports: DeleteMarmitaPorts) {
  const existing = await ports.findMarmitaById(id);
  if (!existing) throw new NotFoundError('Marmita');

  const pedidosCount = await ports.countPedidosByMarmita(id);
  if (pedidosCount > 0) throw new ConflictError('Marmita possui pedidos e não pode ser removida');

  await ports.deleteMarmita(id);
}
