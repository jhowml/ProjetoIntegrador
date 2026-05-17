import { findClienteById } from '@/modules/clientes/repositories/cliente.repository';
import { findMarmitaById } from '@/modules/marmitas/repositories/marmita.repository';
import { insertPedido } from '@/modules/pedidos/repositories/pedido.repository';

export type CreatePedidoPorts = {
  findClienteById: typeof findClienteById;
  findMarmitaById: typeof findMarmitaById;
  insertPedido: typeof insertPedido;
};
