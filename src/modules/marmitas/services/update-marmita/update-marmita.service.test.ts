import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateMarmita } from './update-marmita.service';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../repositories/marmita.repository', () => ({
  findMarmitaById: vi.fn(),
  updateMarmita: vi.fn(),
}));

import { findMarmitaById, updateMarmita as updateMarmitaRepository } from '../../repositories/marmita.repository';

const fakeMarmita = {
  idMarmita: 1,
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

describe('updateMarmita service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update and return the marmita when it exists', async () => {
    const updatedData = { descricao: 'Marmita atualizada' };
    const updatedMarmita = { ...fakeMarmita, ...updatedData };

    vi.mocked(findMarmitaById).mockResolvedValue(fakeMarmita);
    vi.mocked(updateMarmitaRepository).mockResolvedValue(updatedMarmita);

    const result = await updateMarmita(1, updatedData);

    expect(findMarmitaById).toHaveBeenCalledWith(1);
    expect(updateMarmitaRepository).toHaveBeenCalledWith(1, updatedData);
    expect(result).toEqual(updatedMarmita);
  });

  it('should throw NotFoundError when marmita does not exist', async () => {
    vi.mocked(findMarmitaById).mockResolvedValue(null);

    await expect(updateMarmita(99, { descricao: 'Teste' })).rejects.toThrow(NotFoundError);
    expect(updateMarmitaRepository).not.toHaveBeenCalled();
  });
});
