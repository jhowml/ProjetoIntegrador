import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listMarmitas } from './list-marmitas.service';

vi.mock('../../repositories/marmita.repository', () => ({
  listMarmitas: vi.fn(),
}));

import { listMarmitas as listMarmitasRepository } from '../../repositories/marmita.repository';

describe('listMarmitas', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return a paginated list of marmitas', async () => {
    const fakeMarmitas = [
      { idMarmita: 1, descricao: 'Marmita P', precoBase: 12.9, adicionalEmbalagem: 0.5, peso: 0.3 },
    ];

    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: fakeMarmitas, total: 1 });

    const result = await listMarmitas({ page: 1, pageSize: 20 });

    expect(result.data).toEqual(fakeMarmitas);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should return an empty list when there are no marmitas', async () => {
    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: [], total: 0 });

    const result = await listMarmitas({ page: 1, pageSize: 20 });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should filter by description when search is provided', async () => {
    const fakeMarmitas = [
      { idMarmita: 2, descricao: 'Marmita Fit', precoBase: 18.9, adicionalEmbalagem: 0.5, peso: 0.25 },
    ];

    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: fakeMarmitas, total: 1 });

    const result = await listMarmitas({ page: 1, pageSize: 20, search: 'Fit' });

    expect(result.data[0].descricao).toBe('Marmita Fit');
  });

  it('should set hasNextPage to true when there are more pages', async () => {
    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: [], total: 25 });

    const result = await listMarmitas({ page: 1, pageSize: 20 });

    expect(result.meta.hasNextPage).toBe(true);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should set hasPreviousPage to true when not on the first page', async () => {
    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: [], total: 25 });

    const result = await listMarmitas({ page: 2, pageSize: 20 });

    expect(result.meta.hasPreviousPage).toBe(true);
  });
});
