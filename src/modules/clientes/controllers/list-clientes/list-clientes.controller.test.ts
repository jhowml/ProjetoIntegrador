import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { listClientesController } from './list-clientes.controller';

vi.mock('../../services/list-clientes/list-clientes.service', () => ({
  listClientes: vi.fn(),
}));

import { listClientes } from '../../services/list-clientes/list-clientes.service';

function makeMocks() {
  const req = { query: {} } as unknown as Request;
  const res = { json: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('listClientesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call res.json with the service result', async () => {
    const fakeResult = {
      data: [],
      meta: { total: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    };
    vi.mocked(listClientes).mockResolvedValue(fakeResult);

    const { req, res, next } = makeMocks();
    await listClientesController(req, res, next);

    expect(res.json).toHaveBeenCalledWith(fakeResult);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with the error when the service throws', async () => {
    const error = new Error('database failure');
    vi.mocked(listClientes).mockRejectedValue(error);

    const { req, res, next } = makeMocks();
    await listClientesController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
