import { ConflictError, NotFoundError } from '@/shared/errors/AppError';
import type { DeleteClientePorts } from '@/composition/cliente-deletion.ports';

export async function deleteCliente(id: number, ports: DeleteClientePorts) {
  const existing = await ports.findClienteById(id);
  if (!existing) throw new NotFoundError('Cliente');

  const pedidosCount = await ports.countPedidosByCliente(id);
  if (pedidosCount > 0) throw new ConflictError('Cliente possui pedidos e não pode ser removido');

  await ports.deleteCliente(id);
}
