import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateCliente } from './update-cliente.service';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../repositories/cliente.repository', () => ({
  findClienteById: vi.fn(),
  updateCliente: vi.fn(),
}));

import { findClienteById, updateCliente as updateClienteRepository } from '../../repositories/cliente.repository';

const fakeCliente = { idClientes: 1, nome: 'João Silva', telefone: '11999999999', endereco: 'Rua das Flores, 123', obs: null };

describe('updateCliente service', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should update and return the cliente when it exists', async () => {
    const updatedData = { nome: 'João Atualizado' };
    const updatedCliente = { ...fakeCliente, ...updatedData };

    vi.mocked(findClienteById).mockResolvedValue(fakeCliente);
    vi.mocked(updateClienteRepository).mockResolvedValue(updatedCliente);

    const result = await updateCliente(1, updatedData);

    expect(findClienteById).toHaveBeenCalledWith(1);
    expect(updateClienteRepository).toHaveBeenCalledWith(1, updatedData);
    expect(result).toEqual(updatedCliente);
  });

  it('should throw NotFoundError when cliente does not exist', async () => {
    vi.mocked(findClienteById).mockResolvedValue(null);

    await expect(updateCliente(99, { nome: 'Teste' })).rejects.toThrow(NotFoundError);
    expect(updateClienteRepository).not.toHaveBeenCalled();
  });
});
