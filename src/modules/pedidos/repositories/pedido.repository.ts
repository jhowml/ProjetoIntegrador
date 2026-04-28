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
    ...(query.marmitaId && { marmitasIdMarmita: query.marmitaId }),
    ...(query.search && {
      OR: [
        { cliente: { nome: { contains: query.search } } },
        { marmita: { descricao: { contains: query.search } } },
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
    prisma.pedido.findMany({ where, take, skip, orderBy: { dataPedido: 'desc' }, include: { cliente: true, marmita: true } }),
    prisma.pedido.count({ where }),
  ]);

  return { data, total };
}

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
