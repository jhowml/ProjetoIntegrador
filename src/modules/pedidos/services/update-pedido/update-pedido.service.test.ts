import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updatePedido } from './update-pedido.service';
import { NotFoundError } from '@/shared/errors/AppError';
import type { UpdatePedidoPorts } from '@/composition/pedido-update.ports';

const existingPedido = {
  idPedidos: 1,
  dataPedido: new Date(),
  status: 'PENDENTE' as const,
  dataEntrega: null,
  valorTotal: '21.00',
  clientesIdClientes: 1,
  itens: [{ idPedidoItem: 1, pedidosIdPedidos: 1, marmitasIdMarmita: 2, quantidade: 2, precoUnitario: '10.50' }],
};

const fakeMarmita = {
  idMarmita: 2,
  descricao: 'Marmita P',
  precoBase: '10.00',
  adicionalEmbalagem: '0.50',
  peso: '300.00',
};

function makePorts(overrides: Partial<UpdatePedidoPorts> = {}): UpdatePedidoPorts {
  return {
    findPedidoById: vi.fn(),
    findClienteById: vi.fn(),
    findMarmitaById: vi.fn(),
    updatePedido: vi.fn(),
    replacePedidoItens: vi.fn(),
    ...overrides,
  };
}

describe('updatePedido service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundError when pedido does not exist', async () => {
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(null),
    });

    await expect(updatePedido(99, { status: 'CONFIRMADO' }, ports)).rejects.toThrow(NotFoundError);
    expect(ports.updatePedido).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when clienteId is set but cliente does not exist', async () => {
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findClienteById: vi.fn().mockResolvedValue(null),
    });

    await expect(updatePedido(1, { clienteId: 999 }, ports)).rejects.toThrow(NotFoundError);
    expect(ports.updatePedido).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when itens contain an invalid marmitaId', async () => {
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findMarmitaById: vi.fn().mockResolvedValue(null),
    });

    await expect(
      updatePedido(1, { itens: [{ marmitaId: 999, quantidade: 2 }] }, ports),
    ).rejects.toThrow(NotFoundError);
    expect(ports.replacePedidoItens).not.toHaveBeenCalled();
  });

  it('should update only status without fetching marmita', async () => {
    const findMarmitaById = vi.fn();
    const updatePedidoRepo = vi.fn().mockResolvedValue(existingPedido);
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findMarmitaById,
      updatePedido: updatePedidoRepo,
    });

    await updatePedido(1, { status: 'CONFIRMADO' }, ports);

    expect(findMarmitaById).not.toHaveBeenCalled();
    expect(ports.replacePedidoItens).not.toHaveBeenCalled();
    expect(updatePedidoRepo).toHaveBeenCalledWith(1, { status: 'CONFIRMADO' });
  });

  it('should call replacePedidoItens with new items and recalculated total', async () => {
    const findMarmitaById = vi.fn().mockResolvedValue(fakeMarmita);
    const replacePedidoItens = vi.fn().mockResolvedValue(undefined);
    const ports = makePorts({
      findPedidoById: vi
        .fn()
        .mockResolvedValueOnce(existingPedido)
        .mockResolvedValueOnce(existingPedido),
      findMarmitaById,
      replacePedidoItens,
    });

    await updatePedido(1, { itens: [{ marmitaId: 2, quantidade: 5 }] }, ports);

    expect(replacePedidoItens).toHaveBeenCalledWith(
      1,
      expect.arrayContaining([
        expect.objectContaining({ marmitasIdMarmita: 2, quantidade: 5 }),
      ]),
      expect.any(Object),
    );
  });

  it('should validate cliente and persist clienteId', async () => {
    const findClienteById = vi.fn().mockResolvedValue({ idClientes: 5 });
    const updatePedidoRepo = vi.fn().mockResolvedValue(existingPedido);
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findClienteById,
      updatePedido: updatePedidoRepo,
    });

    await updatePedido(1, { clienteId: 5 }, ports);

    expect(findClienteById).toHaveBeenCalledWith(5);
    expect(updatePedidoRepo).toHaveBeenCalledWith(1, { clientesIdClientes: 5 });
  });
});
