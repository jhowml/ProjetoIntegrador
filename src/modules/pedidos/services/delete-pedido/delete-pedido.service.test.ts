import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deletePedido } from './delete-pedido.service';
import { NotFoundError } from '@/shared/errors/AppError';
import type { DeletePedidoPorts } from '@/composition/pedido-deletion.ports';

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

function makePorts(overrides: Partial<DeletePedidoPorts> = {}): DeletePedidoPorts {
  return {
    findPedidoById: vi.fn(),
    deletePedido: vi.fn(),
    ...overrides,
  };
}

describe('deletePedido service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete when pedido exists', async () => {
    const findPedidoById = vi.fn().mockResolvedValue(existingPedido);
    const deletePedidoRepo = vi.fn().mockResolvedValue(existingPedido);
    const ports = makePorts({ findPedidoById, deletePedido: deletePedidoRepo });

    await deletePedido(1, ports);

    expect(findPedidoById).toHaveBeenCalledWith(1);
    expect(deletePedidoRepo).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundError when pedido does not exist', async () => {
    const deletePedidoRepo = vi.fn();
    const ports = makePorts({
      findPedidoById: vi.fn().mockResolvedValue(null),
      deletePedido: deletePedidoRepo,
    });

    await expect(deletePedido(99, ports)).rejects.toThrow(NotFoundError);
    expect(deletePedidoRepo).not.toHaveBeenCalled();
  });
});
