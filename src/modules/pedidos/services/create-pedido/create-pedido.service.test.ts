import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPedido } from './create-pedido.service';
import { NotFoundError } from '@/shared/errors/AppError';
import type { CreatePedidoPorts } from '@/composition/pedido-creation.ports';

const validDto = {
  clienteId: 1,
  itens: [
    { marmitaId: 2, quantidade: 3 },
    { marmitaId: 3, quantidade: 1 },
  ],
};

const fakeCliente = { idClientes: 1, nome: 'João', telefone: '11999999999', endereco: 'Rua A', obs: null };
const fakeMarmita2 = {
  idMarmita: 2,
  descricao: 'Marmita P',
  precoBase: '10.00',
  adicionalEmbalagem: '0.50',
  peso: '300.00',
};
const fakeMarmita3 = {
  idMarmita: 3,
  descricao: 'Marmita M',
  precoBase: '14.00',
  adicionalEmbalagem: '0.50',
  peso: '500.00',
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
      findMarmitaById: vi.fn().mockResolvedValue(fakeMarmita2),
      insertPedido,
    });

    await expect(createPedido(validDto, ports)).rejects.toThrow(NotFoundError);
    expect(insertPedido).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when a marmita does not exist', async () => {
    const insertPedido = vi.fn();
    const ports = makePorts({
      findClienteById: vi.fn().mockResolvedValue(fakeCliente),
      findMarmitaById: vi.fn().mockResolvedValue(null),
      insertPedido,
    });

    await expect(createPedido(validDto, ports)).rejects.toThrow(NotFoundError);
    expect(insertPedido).not.toHaveBeenCalled();
  });

  it('should pass items with precoUnitario to insertPedido', async () => {
    const findMarmitaById = vi
      .fn()
      .mockResolvedValueOnce(fakeMarmita2)
      .mockResolvedValueOnce(fakeMarmita3);
    const insertPedido = vi.fn().mockResolvedValue({ idPedidos: 1 });
    const ports = makePorts({
      findClienteById: vi.fn().mockResolvedValue(fakeCliente),
      findMarmitaById,
      insertPedido,
    });

    const result = await createPedido(validDto, ports);

    expect(insertPedido).toHaveBeenCalledWith(
      expect.objectContaining({
        clientesIdClientes: 1,
        itens: expect.arrayContaining([
          expect.objectContaining({ marmitasIdMarmita: 2, quantidade: 3 }),
          expect.objectContaining({ marmitasIdMarmita: 3, quantidade: 1 }),
        ]),
      }),
    );
    expect(result).toEqual({ idPedidos: 1 });
  });

  it('should pass dataEntrega when provided', async () => {
    const dataEntrega = new Date('2026-06-15T12:00:00.000Z');
    const findMarmitaById = vi
      .fn()
      .mockResolvedValueOnce(fakeMarmita2)
      .mockResolvedValueOnce(fakeMarmita3);
    const insertPedido = vi.fn().mockResolvedValue({});
    const ports = makePorts({
      findClienteById: vi.fn().mockResolvedValue(fakeCliente),
      findMarmitaById,
      insertPedido,
    });

    await createPedido({ ...validDto, dataEntrega }, ports);

    expect(insertPedido).toHaveBeenCalledWith(
      expect.objectContaining({ dataEntrega }),
    );
  });
});
