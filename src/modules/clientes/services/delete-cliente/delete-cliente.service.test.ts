import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteCliente } from './delete-cliente.service';
import { NotFoundError } from '@/shared/errors/AppError';

vi.mock('../../repositories/cliente.repository', () => ({
  findClienteById: vi.fn(),
  deleteCliente: vi.fn(),
}));

import { findClienteById, deleteCliente as deleteClienteRepository } from '../../repositories/cliente.repository';

const fakeCliente = { idClientes: 1, nome: 'João Silva', telefone: '11999999999', endereco: 'Rua das Flores, 123', obs: null };

describe('deleteCliente service', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should delete the cliente when it exists', async () => {
    vi.mocked(findClienteById).mockResolvedValue(fakeCliente);
    vi.mocked(deleteClienteRepository).mockResolvedValue(fakeCliente);

    await deleteCliente(1);

    expect(findClienteById).toHaveBeenCalledWith(1);
    expect(deleteClienteRepository).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundError when cliente does not exist', async () => {
    vi.mocked(findClienteById).mockResolvedValue(null);

    await expect(deleteCliente(99)).rejects.toThrow(NotFoundError);
    expect(deleteClienteRepository).not.toHaveBeenCalled();
  });
});
