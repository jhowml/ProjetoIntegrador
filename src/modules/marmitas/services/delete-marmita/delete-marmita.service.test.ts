import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteMarmita } from './delete-marmita.service';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../repositories/marmita.repository', () => ({
  findMarmitaById: vi.fn(),
  deleteMarmita: vi.fn(),
}));

import { findMarmitaById, deleteMarmita as deleteMarmitaRepository } from '../../repositories/marmita.repository';

const fakeMarmita = {
  idMarmita: 1,
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

describe('deleteMarmita service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete the marmita when it exists', async () => {
    vi.mocked(findMarmitaById).mockResolvedValue(fakeMarmita);
    vi.mocked(deleteMarmitaRepository).mockResolvedValue(fakeMarmita);

    await deleteMarmita(1);

    expect(findMarmitaById).toHaveBeenCalledWith(1);
    expect(deleteMarmitaRepository).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundError when marmita does not exist', async () => {
    vi.mocked(findMarmitaById).mockResolvedValue(null);

    await expect(deleteMarmita(99)).rejects.toThrow(NotFoundError);
    expect(deleteMarmitaRepository).not.toHaveBeenCalled();
  });
});
