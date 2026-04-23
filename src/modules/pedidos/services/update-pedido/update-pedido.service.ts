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

  const needsPriceRecalc = dto.marmitaId !== undefined || dto.quantidadeMarmitas !== undefined;

  if (needsPriceRecalc) {
    const effectiveMarmitaId = dto.marmitaId ?? existing.marmitasIdMarmita;
    const effectiveQty = dto.quantidadeMarmitas ?? existing.quantidadeMarmitas;

    const marmita = await ports.findMarmitaById(effectiveMarmitaId);
    if (!marmita) throw new NotFoundError('Marmita');

    const unitPrice = new Decimal(marmita.precoBase.toString()).plus(marmita.adicionalEmbalagem.toString());
    data.valorTotal = unitPrice.mul(effectiveQty);
    if (dto.marmitaId !== undefined) data.marmitasIdMarmita = dto.marmitaId;
    if (dto.quantidadeMarmitas !== undefined) data.quantidadeMarmitas = dto.quantidadeMarmitas;
  }

  return ports.updatePedido(id, data);
}
