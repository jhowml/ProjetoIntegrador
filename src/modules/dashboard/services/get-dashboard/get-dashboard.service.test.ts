import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboard } from './get-dashboard.service';

vi.mock('../../repositories/dashboard.repository', () => ({
  getDashboardData: vi.fn(),
}));

import { getDashboardData } from '../../repositories/dashboard.repository';

const fakePedidoRecente = {
  idPedidos: 1,
  dataPedido: new Date('2026-04-20'),
  status: 'PREPARANDO' as const,
  dataEntrega: new Date('2026-04-21'),
  quantidadeMarmitas: 1,
  valorTotal: '19.00',
  clientesIdClientes: 1,
  marmitasIdMarmita: 1,
  cliente: { idClientes: 1, nome: 'Jorge', telefone: '11999999999', endereco: null, obs: null },
};

describe('getDashboard service', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return aggregated dashboard data', async () => {
    vi.mocked(getDashboardData).mockResolvedValue({
      totalPedidos: 5,
      pendentes: 2,
      entregues: 1,
      totalClientes: 3,
      pedidosRecentes: [fakePedidoRecente],
    });

    const result = await getDashboard();

    expect(result.totalPedidos).toBe(5);
    expect(result.pendentes).toBe(2);
    expect(result.entregues).toBe(1);
    expect(result.totalClientes).toBe(3);
    expect(result.pedidosRecentes).toHaveLength(1);
  });

  it('should map pedidosRecentes to the correct shape', async () => {
    vi.mocked(getDashboardData).mockResolvedValue({
      totalPedidos: 1,
      pendentes: 0,
      entregues: 0,
      totalClientes: 1,
      pedidosRecentes: [fakePedidoRecente],
    });

    const result = await getDashboard();
    const pedido = result.pedidosRecentes[0];

    expect(pedido).toEqual({
      id: 1,
      clienteNome: 'Jorge',
      dataEntrega: fakePedidoRecente.dataEntrega,
      quantidadeMarmitas: 1,
      status: 'PREPARANDO',
    });
  });

  it('should return empty pedidosRecentes when there are no pedidos', async () => {
    vi.mocked(getDashboardData).mockResolvedValue({
      totalPedidos: 0,
      pendentes: 0,
      entregues: 0,
      totalClientes: 0,
      pedidosRecentes: [],
    });

    const result = await getDashboard();

    expect(result.pedidosRecentes).toHaveLength(0);
  });
});
