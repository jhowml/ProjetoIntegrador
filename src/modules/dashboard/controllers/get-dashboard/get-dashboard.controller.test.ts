import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { getDashboardController } from './get-dashboard.controller';

vi.mock('../../services/get-dashboard/get-dashboard.service', () => ({
  getDashboard: vi.fn(),
}));

import { getDashboard } from '../../services/get-dashboard/get-dashboard.service';

const fakeResult = {
  totalPedidos: 1,
  pendentes: 0,
  entregues: 0,
  totalClientes: 1,
  pedidosRecentes: [
    { id: 1, clienteNome: 'Jorge', dataEntrega: new Date('2026-04-21'), quantidadeMarmitas: 1, status: 'PREPARANDO' },
  ],
};

function makeMocks() {
  const req = {} as unknown as Request;
  const res = { json: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('getDashboardController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should call res.json with the service result', async () => {
    vi.mocked(getDashboard).mockResolvedValue(fakeResult);

    const { req, res, next } = makeMocks();
    await getDashboardController(req, res, next);

    expect(res.json).toHaveBeenCalledWith(fakeResult);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with the error when the service throws', async () => {
    const error = new Error('database failure');
    vi.mocked(getDashboard).mockRejectedValue(error);

    const { req, res, next } = makeMocks();
    await getDashboardController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
