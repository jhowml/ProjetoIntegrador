import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPedido } from './create-pedido.service';
import { NotFoundError } from '@/shared/errors/AppError';
import type { CreatePedidoPorts } from '@/composition/pedido-creation.ports';

const validDto = {
  clienteId: 1,
  marmitaId: 2,
  quantidadeMarmitas: 3,
};

const fakeCliente = { idClientes: 1, nome: 'João', telefone: '11999999999', endereco: 'Rua A', obs: null };
const fakeMarmita = {
  idMarmita: 2,
  descricao: 'Marmita P',
  precoBase: '10.00',
  adicionalEmbalagem: '0.50',
  peso: '300.00',
};

function makePorts(overrides: Partial<CreatePedidoPorts> = {}): CreatePedidoPorts {
  return {
    findClienteById: vi.fn(),
    findMarmitaById: vi.fn(),
    insertPedido: vi.fn(),
    ...overrides,
  };
}

describe('createPedido service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundError when cliente does not exist', async () => {
    const insertPedido = vi.fn();
    const ports = makePorts({
      findClienteById: vi.fn().mockResolvedValue(null),
      findMarmitaById: vi.fn().mockResolvedValue(fakeMarmita),
      insertPedido,
    });

    await expect(createPedido(validDto, ports)).rejects.toThrow(NotFoundError);
    expect(insertPedido).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when marmita does not exist', async () => {
    const insertPedido = vi.fn();
    const ports = makePorts({
      findClienteById: vi.fn().mockResolvedValue(fakeCliente),
      findMarmitaById: vi.fn().mockResolvedValue(null),
      insertPedido,
    });

    await expect(createPedido(validDto, ports)).rejects.toThrow(NotFoundError);
    expect(insertPedido).not.toHaveBeenCalled();
  });

  it('should pass pricing fields to insertPedido', async () => {
    const findClienteById = vi.fn().mockResolvedValue(fakeCliente);
    const findMarmitaById = vi.fn().mockResolvedValue(fakeMarmita);
    const insertPedido = vi.fn();
    const fakePedido = { idPedidos: 1, status: 'PENDENTE' as const, valorTotal: '31.50' };
    insertPedido.mockResolvedValue(fakePedido);
    const ports = makePorts({ findClienteById, findMarmitaById, insertPedido });

    const result = await createPedido(validDto, ports);

    expect(insertPedido).toHaveBeenCalledWith({
      clientesIdClientes: 1,
      marmitasIdMarmita: 2,
      quantidadeMarmitas: 3,
      precoBase: '10.00',
      adicionalEmbalagem: '0.50',
    });
    expect(result).toEqual(fakePedido);
  });

  it('should pass dataEntrega when provided', async () => {
    const dataEntrega = new Date('2026-06-15T12:00:00.000Z');
    const findClienteById = vi.fn().mockResolvedValue(fakeCliente);
    const findMarmitaById = vi.fn().mockResolvedValue(fakeMarmita);
    const insertPedido = vi.fn().mockResolvedValue({});
    const ports = makePorts({ findClienteById, findMarmitaById, insertPedido });

    await createPedido({ ...validDto, dataEntrega }, ports);

    expect(insertPedido).toHaveBeenCalledWith(
      expect.objectContaining({
        dataEntrega,
      }),
    );
  });
});
