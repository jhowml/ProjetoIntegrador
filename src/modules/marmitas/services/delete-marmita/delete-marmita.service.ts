import { HasPedidosError, NotFoundError } from '@/shared/errors/AppError';
import type { DeleteMarmitaPorts } from '@/composition/marmita-deletion.ports';

export async function deleteMarmita(id: number, force: boolean, ports: DeleteMarmitaPorts) {
  const existing = await ports.findMarmitaById(id);
  if (!existing) throw new NotFoundError('Marmita');

  if (!force) {
    const pedidosCount = await ports.countPedidosByMarmita(id);
    if (pedidosCount > 0) throw new HasPedidosError('Marmita');
  }

  await ports.deleteMarmita(id);
}
