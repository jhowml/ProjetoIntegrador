import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { deleteMarmitaController } from './delete-marmita.controller';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../services/delete-marmita/delete-marmita.service', () => ({
  deleteMarmita: vi.fn(),
}));

import { deleteMarmita } from '../../services/delete-marmita/delete-marmita.service';

function makeMocks(params = { id: '1' }) {
  const req = { params } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('deleteMarmitaController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 204 when marmita is deleted', async () => {
    vi.mocked(deleteMarmita).mockResolvedValue(undefined);

    const { req, res, next } = makeMocks();
    await deleteMarmitaController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with NotFoundError when marmita does not exist', async () => {
    vi.mocked(deleteMarmita).mockRejectedValue(new NotFoundError('Marmita'));

    const { req, res, next } = makeMocks({ id: '99' });
    await deleteMarmitaController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should call next with validation error when params are invalid', async () => {
    const { req, res, next } = makeMocks({ id: 'abc' });
    await deleteMarmitaController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
