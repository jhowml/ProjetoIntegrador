import type { CreatePedidoDTO } from '@/modules/pedidos/dtos/create-pedido/create-pedido.types';
import type { CreatePedidoPorts } from '@/composition/pedido-creation.ports';
import { NotFoundError } from '@/shared/errors/AppError';

export async function createPedido(dto: CreatePedidoDTO, ports: CreatePedidoPorts) {
  const { findClienteById, findMarmitaById, insertPedido } = ports;

  const [cliente, marmita] = await Promise.all([
    findClienteById(dto.clienteId),
    findMarmitaById(dto.marmitaId),
  ]);

  if (!cliente) {
    throw new NotFoundError('Cliente');
  }
  if (!marmita) {
    throw new NotFoundError('Marmita');
  }

  return insertPedido({
    clientesIdClientes: dto.clienteId,
    marmitasIdMarmita: dto.marmitaId,
    quantidadeMarmitas: dto.quantidadeMarmitas,
    precoBase: marmita.precoBase.toString(),
    adicionalEmbalagem: marmita.adicionalEmbalagem.toString(),
    dataEntrega: dto.dataEntrega,
  });
}
