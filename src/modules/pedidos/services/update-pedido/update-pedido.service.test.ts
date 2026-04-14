import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updatePedido } from './update-pedido.service';
import { NotFoundError } from '@/shared/errors/AppError';
import type { UpdatePedidoPorts } from '@/composition/pedido-update.ports';

const existingPedido = {
  idPedidos: 1,
  dataPedido: new Date(),
  status: 'PENDENTE' as const,
  dataEntrega: null,
  quantidadeMarmitas: 2,
  valorTotal: '21.00',
  clientesIdClientes: 1,
  marmitasIdMarmita: 2,
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

  it('should throw NotFoundError when marmita is missing during price recalc', async () => {
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findMarmitaById: vi.fn().mockResolvedValue(null),
    });

    await expect(updatePedido(1, { quantidadeMarmitas: 5 }, ports)).rejects.toThrow(NotFoundError);
    expect(ports.updatePedido).not.toHaveBeenCalled();
  });

  it('should update only status without fetching marmita', async () => {
    const findMarmitaById = vi.fn();
    const updatePedidoRepo = vi.fn().mockResolvedValue({ ...existingPedido, status: 'CONFIRMADO' });
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findMarmitaById,
      updatePedido: updatePedidoRepo,
    });

    await updatePedido(1, { status: 'CONFIRMADO' }, ports);

    expect(findMarmitaById).not.toHaveBeenCalled();
    expect(updatePedidoRepo).toHaveBeenCalledWith(1, { status: 'CONFIRMADO' });
  });

  it('should recalc valorTotal when quantidadeMarmitas changes', async () => {
    const findMarmitaById = vi.fn().mockResolvedValue(fakeMarmita);
    const updatePedidoRepo = vi.fn().mockResolvedValue({});
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(existingPedido),
      findMarmitaById,
      updatePedido: updatePedidoRepo,
    });

    await updatePedido(1, { quantidadeMarmitas: 3 }, ports);

    expect(findMarmitaById).toHaveBeenCalledWith(2);
    expect(updatePedidoRepo).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        quantidadeMarmitas: 3,
        valorTotal: expect.any(Object),
      }),
    );
  });

  it('should validate cliente and persist clienteId', async () => {
    const findClienteById = vi.fn().mockResolvedValue({ idClientes: 5 });
    const updatePedidoRepo = vi.fn().mockResolvedValue({});
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
