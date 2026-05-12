import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/config/database';
import { paginate } from '@/shared/types/pagination';
import { ListPedidosDTO } from '@/modules/pedidos/dtos/list-pedidos/list-pedidos.types';

export async function listPedidos(query: ListPedidosDTO) {
  const { take, skip } = paginate(query.page, query.pageSize);

  const where: Prisma.PedidoWhereInput = {
    ...(query.status && { status: query.status }),
    ...(query.clienteId && { clientesIdClientes: query.clienteId }),
    ...(query.marmitaId && { itens: { some: { marmitasIdMarmita: query.marmitaId } } }),
    ...(query.search && {
      OR: [
        { cliente: { nome: { contains: query.search } } },
        { itens: { some: { marmita: { descricao: { contains: query.search } } } } },
        ...(!isNaN(Number(query.search)) ? [{ idPedidos: Number(query.search) }] : []),
      ],
    }),
    ...((query.dataInicio || query.dataFim) && {
      dataPedido: {
        ...(query.dataInicio && { gte: query.dataInicio }),
        ...(query.dataFim && { lte: query.dataFim }),
      },
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.pedido.findMany({
      where,
      take,
      skip,
      orderBy: { dataPedido: 'desc' },
      include: { cliente: true, itens: { include: { marmita: true } } },
    }),
    prisma.pedido.count({ where }),
  ]);

  return { data, total };
}

export type PedidoItemInput = {
  marmitasIdMarmita: number;
  quantidade: number;
  precoUnitario: Decimal;
};

export type PedidoInsertInput = {
  clientesIdClientes: number;
  dataEntrega?: Date;
  itens: PedidoItemInput[];
};

export async function insertPedido(input: PedidoInsertInput) {
  const valorTotal = input.itens.reduce(
    (sum, item) => sum.plus(new Decimal(item.precoUnitario).mul(item.quantidade)),
    new Decimal(0),
  );

  return prisma.pedido.create({
    data: {
      clientesIdClientes: input.clientesIdClientes,
      valorTotal,
      ...(input.dataEntrega !== undefined && { dataEntrega: input.dataEntrega }),
      itens: {
        create: input.itens.map((item) => ({
          marmitasIdMarmita: item.marmitasIdMarmita,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        })),
      },
    },
    include: { itens: { include: { marmita: true } } },
  });
}

export async function findPedidoById(id: number) {
  return prisma.pedido.findUnique({
    where: { idPedidos: id },
    include: { cliente: true, itens: { include: { marmita: true } } },
  });
}

export async function updatePedido(id: number, data: Prisma.PedidoUncheckedUpdateInput) {
  return prisma.pedido.update({ where: { idPedidos: id }, data });
}

export async function replacePedidoItens(
  pedidoId: number,
  itens: PedidoItemInput[],
  novoValorTotal: Decimal,
) {
  await prisma.$transaction([
    prisma.pedidoItem.deleteMany({ where: { pedidosIdPedidos: pedidoId } }),
    prisma.pedidoItem.createMany({
      data: itens.map((item) => ({
        pedidosIdPedidos: pedidoId,
        marmitasIdMarmita: item.marmitasIdMarmita,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    }),
    prisma.pedido.update({
      where: { idPedidos: pedidoId },
      data: { valorTotal: novoValorTotal },
    }),
  ]);
}

export async function deletePedido(id: number) {
  await prisma.pagamento.deleteMany({ where: { pedidosIdPedidos: id } });
  return prisma.pedido.delete({ where: { idPedidos: id } });
}
