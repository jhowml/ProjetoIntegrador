import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { updatePedidoController } from './update-pedido.controller';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('@/composition/pedido-update', () => ({
  updatePedido: vi.fn(),
}));

import { updatePedido } from '@/composition/pedido-update';

const fakePedido = {
  idPedidos: 1,
  status: 'CONFIRMADO' as const,
  quantidadeMarmitas: 2,
  valorTotal: '21.00',
  clientesIdClientes: 1,
  marmitasIdMarmita: 2,
  dataPedido: new Date(),
  dataEntrega: null,
};

function makeMocks(params = { id: '1' }, body = { status: 'CONFIRMADO' as const }) {
  const req = { params, body } as unknown as Request;
  const res = { json: vi.fn(), status: vi.fn().mockReturnThis() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('updatePedidoController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with updated pedido', async () => {
    vi.mocked(updatePedido).mockResolvedValue(fakePedido as never);

    const { req, res, next } = makeMocks();
    await updatePedidoController(req, res, next);

    expect(res.json).toHaveBeenCalledWith(fakePedido);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with NotFoundError when pedido does not exist', async () => {
    vi.mocked(updatePedido).mockRejectedValue(new NotFoundError('Pedido'));

    const { req, res, next } = makeMocks({ id: '99' });
    await updatePedidoController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should call next with validation error when params are invalid', async () => {
    const { req, res, next } = makeMocks({ id: 'abc' });
    await updatePedidoController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
