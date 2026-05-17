import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { deletePedidoController } from './delete-pedido.controller';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('@/composition/pedido-deletion', () => ({
  deletePedido: vi.fn(),
}));

import { deletePedido } from '@/composition/pedido-deletion';

function makeMocks(params = { id: '1' }) {
  const req = { params } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('deletePedidoController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 204 when pedido is deleted', async () => {
    vi.mocked(deletePedido).mockResolvedValue(undefined);

    const { req, res, next } = makeMocks();
    await deletePedidoController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with NotFoundError when pedido does not exist', async () => {
    vi.mocked(deletePedido).mockRejectedValue(new NotFoundError('Pedido'));

    const { req, res, next } = makeMocks({ id: '99' });
    await deletePedidoController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should call next with validation error when params are invalid', async () => {
    const { req, res, next } = makeMocks({ id: 'abc' });
    await deletePedidoController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
