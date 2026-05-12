import { Decimal } from '@prisma/client/runtime/library';
import type { CreatePedidoDTO } from '@/modules/pedidos/dtos/create-pedido/create-pedido.types';
import type { CreatePedidoPorts } from '@/composition/pedido-creation.ports';
import { NotFoundError } from '@/shared/errors/AppError';

export async function createPedido(dto: CreatePedidoDTO, ports: CreatePedidoPorts) {
  const { findClienteById, findMarmitaById, insertPedido } = ports;

  const cliente = await findClienteById(dto.clienteId);
  if (!cliente) throw new NotFoundError('Cliente');

  const marmitas = await Promise.all(dto.itens.map((item) => findMarmitaById(item.marmitaId)));
  marmitas.forEach((marmita, i) => {
    if (!marmita) throw new NotFoundError(`Marmita (id ${dto.itens[i].marmitaId})`);
  });

  const itens = dto.itens.map((item, i) => ({
    marmitasIdMarmita: item.marmitaId,
    quantidade: item.quantidade,
    precoUnitario: new Decimal(marmitas[i]!.precoBase.toString()).plus(
      marmitas[i]!.adicionalEmbalagem.toString(),
    ),
  }));

  return insertPedido({
    clientesIdClientes: dto.clienteId,
    dataEntrega: dto.dataEntrega,
    itens,
  });
}
