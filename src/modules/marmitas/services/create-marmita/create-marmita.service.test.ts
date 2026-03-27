import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMarmita } from './create-marmita.service';

vi.mock('../../repositories/marmita.repository', () => ({
  createMarmita: vi.fn(),
}));

import { createMarmita as createMarmitaRepository } from '../../repositories/marmita.repository';

const fakeMarmita = {
  idMarmita: 1,
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

const validDTO = {
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

describe('createMarmita', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return the created marmita', async () => {
    vi.mocked(createMarmitaRepository).mockResolvedValue(fakeMarmita);

    const result = await createMarmita(validDTO);

    expect(result).toEqual(fakeMarmita);
    expect(createMarmitaRepository).toHaveBeenCalledWith(validDTO);
  });

  it('should propagate repository errors', async () => {
    vi.mocked(createMarmitaRepository).mockRejectedValue(new Error('db error'));

    await expect(createMarmita(validDTO)).rejects.toThrow('db error');
  });
});
