import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundError } from '@/shared/errors/AppError';
import type { UpdatePedidoBodyDTO } from '@/modules/pedidos/dtos/update-pedido/update-pedido.types';
import type { UpdatePedidoPorts } from '@/composition/pedido-update.ports';

export async function updatePedido(id: number, dto: UpdatePedidoBodyDTO, ports: UpdatePedidoPorts) {
  const existing = await ports.findPedidoById(id);
  if (!existing) throw new NotFoundError('Pedido');

  const data: Prisma.PedidoUncheckedUpdateInput = {};

  if (dto.clienteId !== undefined) {
    const cliente = await ports.findClienteById(dto.clienteId);
    if (!cliente) throw new NotFoundError('Cliente');
    data.clientesIdClientes = dto.clienteId;
  }

  if (dto.status !== undefined) {
    data.status = dto.status;
  }

  if (dto.dataEntrega !== undefined) {
    data.dataEntrega = dto.dataEntrega;
  }

  if (Object.keys(data).length > 0) {
    await ports.updatePedido(id, data);
  }

  if (dto.itens !== undefined) {
    const marmitas = await Promise.all(
      dto.itens.map((item) => ports.findMarmitaById(item.marmitaId)),
    );
    marmitas.forEach((marmita, i) => {
      if (!marmita) throw new NotFoundError(`Marmita (id ${dto.itens![i].marmitaId})`);
    });

    const itens = dto.itens.map((item, i) => ({
      marmitasIdMarmita: item.marmitaId,
      quantidade: item.quantidade,
      precoUnitario: new Decimal(marmitas[i]!.precoBase.toString()).plus(
        marmitas[i]!.adicionalEmbalagem.toString(),
      ),
    }));

    const novoValorTotal = itens.reduce(
      (sum, item) => sum.plus(item.precoUnitario.mul(item.quantidade)),
      new Decimal(0),
    );

    await ports.replacePedidoItens(id, itens, novoValorTotal);
  }

  return ports.findPedidoById(id);
}
