import { findClienteById } from '@/modules/clientes/repositories/cliente.repository';
import { findMarmitaById } from '@/modules/marmitas/repositories/marmita.repository';
import { findPedidoById, updatePedido as persistPedidoUpdate } from '@/modules/pedidos/repositories/pedido.repository';
import type { UpdatePedidoBodyDTO } from '@/modules/pedidos/dtos/update-pedido/update-pedido.types';
import { updatePedido as updatePedidoService } from '@/modules/pedidos/services/update-pedido/update-pedido.service';
import type { UpdatePedidoPorts } from './pedido-update.ports';

const updatePedidoPorts: UpdatePedidoPorts = {
  findPedidoById,
  findClienteById,
  findMarmitaById,
  updatePedido: persistPedidoUpdate,
};

export async function updatePedido(id: number, body: UpdatePedidoBodyDTO) {
  return updatePedidoService(id, body, updatePedidoPorts);
}
