import { HasPedidosError, NotFoundError } from '@/shared/errors/AppError';
import type { DeleteClientePorts } from '@/composition/cliente-deletion.ports';

export async function deleteCliente(id: number, force: boolean, ports: DeleteClientePorts) {
  const existing = await ports.findClienteById(id);
  if (!existing) throw new NotFoundError('Cliente');

  if (!force) {
    const pedidosCount = await ports.countPedidosByCliente(id);
    if (pedidosCount > 0) throw new HasPedidosError('Cliente');
  }

  await ports.deleteCliente(id);
}
