import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { createClienteController } from './create-cliente.controller';

vi.mock('../../dtos/create-cliente/create-cliente.dto', () => ({
  createClienteSchema: {
    parse: vi.fn((body) => body),
  },
}));

vi.mock('../../services/create-cliente/create-cliente.service', () => ({
  createCliente: vi.fn(),
}));

import { createCliente } from '../../services/create-cliente/create-cliente.service';

const validBody = {
  nome: 'João Silva',
  endereco: 'Rua das Flores, 123',
  telefone: '11999999999',
  OBS: 'Sem cebola',
};

const fakeCliente = { idCliente: 1, ...validBody };

function makeMocks(body = validBody) {
  const req = { body } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('createClienteController (cliente)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return 201 with the created cliente', async () => {
    vi.mocked(createCliente).mockResolvedValue(fakeCliente);

    const { req, res, next } = makeMocks();
    await createClienteController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeCliente);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('service failure');
    vi.mocked(createCliente).mockRejectedValue(error);

    const { req, res, next } = makeMocks();
    await createClienteController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should call next with validation error when body is invalid', async () => {
    const { req, res, next } = makeMocks({ nome: '', endereco: '', telefone: '123' } as never);
    await createClienteController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
