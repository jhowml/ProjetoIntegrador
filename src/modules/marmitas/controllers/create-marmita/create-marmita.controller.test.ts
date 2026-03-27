import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { createMarmitaController } from './create-marmita.controller';

vi.mock('../../services/create-marmita/create-marmita.service', () => ({
  createMarmita: vi.fn(),
}));

import { createMarmita } from '../../services/create-marmita/create-marmita.service';

const validBody = {
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

const fakeMarmita = { idMarmita: 1, ...validBody };

function makeMocks(body = validBody) {
  const req = { body } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('createMarmitaController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 201 with the created marmita', async () => {
    vi.mocked(createMarmita).mockResolvedValue(fakeMarmita);

    const { req, res, next } = makeMocks();
    await createMarmitaController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeMarmita);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('service failure');
    vi.mocked(createMarmita).mockRejectedValue(error);

    const { req, res, next } = makeMocks();
    await createMarmitaController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should call next with validation error when body is invalid', async () => {
    const { req, res, next } = makeMocks({ descricao: '', precoBase: -1 } as never);
    await createMarmitaController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
