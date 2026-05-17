import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { deleteClienteController } from './delete-cliente.controller';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../services/delete-cliente/delete-cliente.service', () => ({
  deleteCliente: vi.fn(),
}));

import { deleteCliente } from '../../services/delete-cliente/delete-cliente.service';

function makeMocks(params = { id: '1' }) {
  const req = { params } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('deleteClienteController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return 204 when cliente is deleted', async () => {
    vi.mocked(deleteCliente).mockResolvedValue(undefined);

    const { req, res, next } = makeMocks();
    await deleteClienteController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with NotFoundError when cliente does not exist', async () => {
    vi.mocked(deleteCliente).mockRejectedValue(new NotFoundError('Cliente'));

    const { req, res, next } = makeMocks({ id: '99' });
    await deleteClienteController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should call next with validation error when params are invalid', async () => {
    const { req, res, next } = makeMocks({ id: 'abc' });
    await deleteClienteController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
