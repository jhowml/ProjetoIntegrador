import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCliente } from './create-cliente.service';

vi.mock('../../repositories/cliente.repository', () => ({
  createCliente: vi.fn(),
}));

import { createCliente as createClienteRepository } from '../../repositories/cliente.repository';

const validData = {
  nome: 'João Silva',
  endereco: 'Rua das Flores, 123',
  telefone: '11999999999',
  OBS: 'Sem cebola',
};

const fakeCliente = { idCliente: 1, ...validData };

describe('createCliente service', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should call repository with correct data and return result', async () => {
    vi.mocked(createClienteRepository).mockResolvedValue(fakeCliente);

    const result = await createCliente(validData);

    expect(createClienteRepository).toHaveBeenCalledWith(validData);
    expect(result).toEqual(fakeCliente);
  });

  it('should propagate error when repository throws', async () => {
    const error = new Error('db error');
    vi.mocked(createClienteRepository).mockRejectedValue(error);

    await expect(createCliente(validData)).rejects.toThrow('db error');
  });
});
