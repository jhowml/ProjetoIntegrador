import { findClienteById, countPedidosByCliente, deleteCliente } from '@/modules/clientes/repositories/cliente.repository';

export type DeleteClientePorts = {
  findClienteById: typeof findClienteById;
  countPedidosByCliente: typeof countPedidosByCliente;
  deleteCliente: typeof deleteCliente;
};
