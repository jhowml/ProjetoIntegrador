import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listPedidos } from './list-pedidos.service';

vi.mock('../../repositories/pedido.repository', () => ({
  listPedidos: vi.fn(),
}));

import { listPedidos as listPedidosRepository } from '../../repositories/pedido.repository';

const fakePedido = {
  idPedidos: 1,
  dataPedido: new Date('2026-04-01'),
  status: 'PENDENTE',
  dataEntrega: null,
  quantidadeMarmitas: 2,
  valorTotal: '38.00',
  clientesIdClientes: 1,
  marmitasIdMarmita: 1,
};

describe('listPedidos service', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return a paginated list of pedidos', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [fakePedido], total: 1 });

    const result = await listPedidos({ page: 1, pageSize: 20 });

    expect(result.data).toEqual([fakePedido]);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should return an empty list when there are no pedidos', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [], total: 0 });

    const result = await listPedidos({ page: 1, pageSize: 20 });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it('should set hasNextPage to true when there are more pages', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [], total: 25 });

    const result = await listPedidos({ page: 1, pageSize: 20 });

    expect(result.meta.hasNextPage).toBe(true);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should set hasPreviousPage to true when not on the first page', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [], total: 25 });

    const result = await listPedidos({ page: 2, pageSize: 20 });

    expect(result.meta.hasPreviousPage).toBe(true);
  });

  it('should pass filters to the repository', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [], total: 0 });

    await listPedidos({ page: 1, pageSize: 20, status: 'CONFIRMADO', clienteId: 2, marmitaId: 3 });

    expect(listPedidosRepository).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'CONFIRMADO', clienteId: 2, marmitaId: 3 }),
    );
  });

  it('should pass search to the repository', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [], total: 0 });

    await listPedidos({ page: 1, pageSize: 20, search: 'João' });

    expect(listPedidosRepository).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'João' }),
    );
  });

  it('should pass date range to the repository', async () => {
    vi.mocked(listPedidosRepository).mockResolvedValue({ data: [], total: 0 });

    const dataInicio = new Date('2026-04-01');
    const dataFim = new Date('2026-04-30');

    await listPedidos({ page: 1, pageSize: 20, dataInicio, dataFim });

    expect(listPedidosRepository).toHaveBeenCalledWith(
      expect.objectContaining({ dataInicio, dataFim }),
    );
  });
});
