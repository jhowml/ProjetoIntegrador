import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listClientes } from './list-clientes.service';

vi.mock('../../repositories/cliente.repository', () => ({
  listclientes: vi.fn(),
}));

import { listclientes as listClientesRepository } from '../../repositories/cliente.repository';

describe('listClientes', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return a paginated list of clientes', async () => {
    const fakeClientes = [
      { idCliente: 1, nome: 'João Silva', telefone: '11999999999', endereco: 'Rua das Flores, 123', obs: null },
    ];

    vi.mocked(listClientesRepository).mockResolvedValue({ data: fakeClientes, total: 1 });

    const result = await listClientes({ page: 1, pageSize: 20 });

    expect(result.data).toEqual(fakeClientes);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should return an empty list when there are no clientes', async () => {
    vi.mocked(listClientesRepository).mockResolvedValue({ data: [], total: 0 });

    const result = await listClientes({ page: 1, pageSize: 20 });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should filter by name when search is provided', async () => {
    const fakeClientes = [
      { idCliente: 2, nome: 'Maria Souza', telefone: '11988888888', endereco: 'Av. Brasil, 456', obs: null },
    ];

    vi.mocked(listClientesRepository).mockResolvedValue({ data: fakeClientes, total: 1 });

    const result = await listClientes({ page: 1, pageSize: 20, search: 'Maria' });

    expect(result.data[0].nome).toBe('Maria Souza');
  });

  it('should set hasNextPage to true when there are more pages', async () => {
    vi.mocked(listClientesRepository).mockResolvedValue({ data: [], total: 25 });

    const result = await listClientes({ page: 1, pageSize: 20 });

    expect(result.meta.hasNextPage).toBe(true);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should set hasPreviousPage to true when not on the first page', async () => {
    vi.mocked(listClientesRepository).mockResolvedValue({ data: [], total: 25 });

    const result = await listClientes({ page: 2, pageSize: 20 });

    expect(result.meta.hasPreviousPage).toBe(true);
  });
});
