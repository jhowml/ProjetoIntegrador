import { getDashboardData } from '@/modules/dashboard/repositories/dashboard.repository';

export async function getDashboard() {
  const { totalPedidos, pendentes, entregues, totalClientes, pedidosRecentes } =
    await getDashboardData();

  return {
    totalPedidos,
    pendentes,
    entregues,
    totalClientes,
    pedidosRecentes: pedidosRecentes.map((p) => ({
      id: p.idPedidos,
      clienteNome: p.cliente.nome,
      dataEntrega: p.dataEntrega,
      quantidadeMarmitas: p.quantidadeMarmitas,
      status: p.status,
    })),
  };
}
