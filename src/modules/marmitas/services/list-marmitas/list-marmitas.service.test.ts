import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listMarmitas } from './list-marmitas.service';

vi.mock('../../repositories/marmita.repository', () => ({
  listMarmitas: vi.fn(),
}));

import { listMarmitas as listMarmitasRepository } from '../../repositories/marmita.repository';

describe('listMarmitas', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deve retornar lista paginada de marmitas', async () => {
    const fakeMarmitas = [
      { idMarmita: 1, descricao: 'Marmita P', precoBase: 12.9, adicionalEmbalagem: 0.5, peso: 0.3 },
    ];

    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: fakeMarmitas, total: 1 });

    const result = await listMarmitas({ page: 1, limit: 20 });

    expect(result.data).toEqual(fakeMarmitas);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('deve retornar lista vazia quando não há marmitas', async () => {
    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: [], total: 0 });

    const result = await listMarmitas({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it('deve filtrar por descrição quando search é informado', async () => {
    const fakeMarmitas = [
      { idMarmita: 2, descricao: 'Marmita Fit', precoBase: 18.9, adicionalEmbalagem: 0.5, peso: 0.25 },
    ];

    vi.mocked(listMarmitasRepository).mockResolvedValue({ data: fakeMarmitas, total: 1 });

    const result = await listMarmitas({ page: 1, limit: 20, search: 'Fit' });

    expect(result.data[0].descricao).toBe('Marmita Fit');
  });
});
