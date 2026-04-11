import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { createPedidoController } from './create-pedido.controller';

vi.mock('@/composition/pedido-creation', () => ({
  createPedido: vi.fn(),
}));

import { createPedido } from '@/composition/pedido-creation';

const validBody = {
  clienteId: 1,
  marmitaId: 2,
  quantidadeMarmitas: 2,
};

const fakePedido = {
  idPedidos: 1,
  dataPedido: new Date(),
  status: 'PENDENTE' as const,
  dataEntrega: null,
  quantidadeMarmitas: 2,
  valorTotal: '21.00',
  clientesIdClientes: 1,
  marmitasIdMarmita: 2,
};

function makeMocks(body = validBody) {
  const req = { body } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('createPedidoController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 201 with the created pedido', async () => {
    vi.mocked(createPedido).mockResolvedValue(fakePedido as never);

    const { req, res, next } = makeMocks();
    await createPedidoController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakePedido);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('service failure');
    vi.mocked(createPedido).mockRejectedValue(error);

    const { req, res, next } = makeMocks();
    await createPedidoController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should call next with validation error when body is invalid', async () => {
    const { req, res, next } = makeMocks({ clienteId: 0, marmitaId: 1, quantidadeMarmitas: 1 } as never);
    await createPedidoController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
