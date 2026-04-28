import { prisma } from '@/config/database';

export async function getDashboardData() {
  const [totalPedidos, pendentes, entregues, totalClientes, pedidosRecentes] = await Promise.all([
    prisma.pedido.count(),
    prisma.pedido.count({ where: { status: 'PENDENTE' } }),
    prisma.pedido.count({ where: { status: 'ENTREGUE' } }),
    prisma.cliente.count(),
    prisma.pedido.findMany({
      take: 5,
      orderBy: { dataPedido: 'desc' },
      include: { cliente: true },
    }),
  ]);

  return { totalPedidos, pendentes, entregues, totalClientes, pedidosRecentes };
}
