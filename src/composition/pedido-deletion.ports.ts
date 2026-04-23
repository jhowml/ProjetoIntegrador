import { findPedidoById, deletePedido } from '@/modules/pedidos/repositories/pedido.repository';

export type DeletePedidoPorts = {
  findPedidoById: typeof findPedidoById;
  deletePedido: typeof deletePedido;
};
