import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { updateMarmitaController } from './update-marmita.controller';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../services/update-marmita/update-marmita.service', () => ({
  updateMarmita: vi.fn(),
}));

import { updateMarmita } from '../../services/update-marmita/update-marmita.service';

const fakeMarmita = {
  idMarmita: 1,
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

function makeMocks(params = { id: '1' }, body = { descricao: 'Marmita atualizada' }) {
  const req = { params, body } as unknown as Request;
  const res = { json: vi.fn(), status: vi.fn().mockReturnThis() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('updateMarmitaController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with updated marmita', async () => {
    vi.mocked(updateMarmita).mockResolvedValue(fakeMarmita);

    const { req, res, next } = makeMocks();
    await updateMarmitaController(req, res, next);

    expect(res.json).toHaveBeenCalledWith(fakeMarmita);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with NotFoundError when marmita does not exist', async () => {
    vi.mocked(updateMarmita).mockRejectedValue(new NotFoundError('Marmita'));

    const { req, res, next } = makeMocks({ id: '99' });
    await updateMarmitaController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should call next with validation error when params are invalid', async () => {
    const { req, res, next } = makeMocks({ id: 'abc' });
    await updateMarmitaController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
