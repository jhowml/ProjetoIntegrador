import { findClienteById } from '@/modules/clientes/repositories/cliente.repository';
import { findMarmitaById } from '@/modules/marmitas/repositories/marmita.repository';
import type { CreatePedidoDTO } from '@/modules/pedidos/dtos/create-pedido/create-pedido.types';
import { insertPedido } from '@/modules/pedidos/repositories/pedido.repository';
import { runCreatePedido } from '@/modules/pedidos/services/create-pedido/create-pedido.service';
import type { CreatePedidoPorts } from './pedido-creation.ports';

const createPedidoPorts: CreatePedidoPorts = {
  findClienteById,
  findMarmitaById,
  insertPedido,
};

export async function createPedido(dto: CreatePedidoDTO) {
  return runCreatePedido(dto, createPedidoPorts);
}
