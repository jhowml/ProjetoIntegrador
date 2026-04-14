import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { updateClienteController } from './update-cliente.controller';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../services/update-cliente/update-cliente.service', () => ({
  updateCliente: vi.fn(),
}));

import { updateCliente } from '../../services/update-cliente/update-cliente.service';

const fakeCliente = { idClientes: 1, nome: 'João Atualizado', telefone: '11999999999', endereco: 'Rua das Flores, 123', obs: null };

function makeMocks(params = { id: '1' }, body = { nome: 'João Atualizado' }) {
  const req = { params, body } as unknown as Request;
  const res = { json: vi.fn(), status: vi.fn().mockReturnThis() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('updateClienteController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return 200 with updated cliente', async () => {
    vi.mocked(updateCliente).mockResolvedValue(fakeCliente);

    const { req, res, next } = makeMocks();
    await updateClienteController(req, res, next);

    expect(res.json).toHaveBeenCalledWith(fakeCliente);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with NotFoundError when cliente does not exist', async () => {
    vi.mocked(updateCliente).mockRejectedValue(new NotFoundError('Cliente'));

    const { req, res, next } = makeMocks({ id: '99' });
    await updateClienteController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should call next with validation error when params are invalid', async () => {
    const { req, res, next } = makeMocks({ id: 'abc' });
    await updateClienteController(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
