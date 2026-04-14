import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/config/database';

export type PedidoInsertInput = {
  clientesIdClientes: number;
  marmitasIdMarmita: number;
  quantidadeMarmitas: number;
  precoBase: string;
  adicionalEmbalagem: string;
  dataEntrega?: Date;
};

export async function insertPedido(input: PedidoInsertInput) {
  const unitPrice = new Decimal(input.precoBase).plus(input.adicionalEmbalagem);
  const valorTotal = unitPrice.mul(input.quantidadeMarmitas);

  return prisma.pedido.create({
    data: {
      clientesIdClientes: input.clientesIdClientes,
      marmitasIdMarmita: input.marmitasIdMarmita,
      quantidadeMarmitas: input.quantidadeMarmitas,
      valorTotal,
      ...(input.dataEntrega !== undefined && { dataEntrega: input.dataEntrega }),
    },
  });
}

export async function findPedidoById(id: number) {
  return prisma.pedido.findUnique({ where: { idPedidos: id } });
}

export async function updatePedido(id: number, data: Prisma.PedidoUncheckedUpdateInput) {
  return prisma.pedido.update({ where: { idPedidos: id }, data });
}

export async function deletePedido(id: number) {
  await prisma.pagamento.deleteMany({ where: { pedidosIdPedidos: id } });
  return prisma.pedido.delete({ where: { idPedidos: id } });
}
