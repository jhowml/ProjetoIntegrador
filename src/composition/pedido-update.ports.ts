import { findClienteById } from '@/modules/clientes/repositories/cliente.repository';
import { findMarmitaById } from '@/modules/marmitas/repositories/marmita.repository';
import {
  findPedidoById,
  updatePedido,
  replacePedidoItens,
} from '@/modules/pedidos/repositories/pedido.repository';

export type UpdatePedidoPorts = {
  findPedidoById: typeof findPedidoById;
  findClienteById: typeof findClienteById;
  findMarmitaById: typeof findMarmitaById;
  updatePedido: typeof updatePedido;
  replacePedidoItens: typeof replacePedidoItens;
};
