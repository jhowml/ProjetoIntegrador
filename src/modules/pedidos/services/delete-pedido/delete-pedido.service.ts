import { NotFoundError } from '@/shared/errors/AppError';
import type { DeletePedidoPorts } from '@/composition/pedido-deletion.ports';

export async function deletePedido(id: number, ports: DeletePedidoPorts) {
  const existing = await ports.findPedidoById(id);
  if (!existing) throw new NotFoundError('Pedido');

  await ports.deletePedido(id);
}
