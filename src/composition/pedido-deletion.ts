import { findPedidoById, deletePedido as deletePedidoRepository } from '@/modules/pedidos/repositories/pedido.repository';
import { deletePedido as deletePedidoService } from '@/modules/pedidos/services/delete-pedido/delete-pedido.service';
import type { DeletePedidoPorts } from './pedido-deletion.ports';

const deletePedidoPorts: DeletePedidoPorts = {
  findPedidoById,
  deletePedido: deletePedidoRepository,
};

export async function deletePedido(id: number) {
  return deletePedidoService(id, deletePedidoPorts);
}
