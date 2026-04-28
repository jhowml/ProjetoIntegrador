import { describe, it, expect, vi } from 'vitest';
import { deleteMarmita } from './delete-marmita.service';
import { ConflictError, NotFoundError } from '@/shared/errors/AppError';
import type { DeleteMarmitaPorts } from '@/composition/marmita-deletion.ports';

const fakeMarmita = {
  idMarmita: 1,
  descricao: 'Marmita XL',
  precoBase: 22.9,
  adicionalEmbalagem: 0.5,
  peso: 700,
};

function makePorts(overrides?: Partial<DeleteMarmitaPorts>): DeleteMarmitaPorts {
  return {
    findMarmitaById: vi.fn().mockResolvedValue(fakeMarmita),
    countPedidosByMarmita: vi.fn().mockResolvedValue(0),
    deleteMarmita: vi.fn().mockResolvedValue(fakeMarmita),
    ...overrides,
  };
}

describe('deleteMarmita service', () => {
  it('should delete the marmita when it exists and has no pedidos', async () => {
    const ports = makePorts();
    await deleteMarmita(1, ports);
    expect(ports.findMarmitaById).toHaveBeenCalledWith(1);
    expect(ports.countPedidosByMarmita).toHaveBeenCalledWith(1);
    expect(ports.deleteMarmita).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundError when marmita does not exist', async () => {
    const ports = makePorts({ findMarmitaById: vi.fn().mockResolvedValue(null) });
    await expect(deleteMarmita(99, ports)).rejects.toThrow(NotFoundError);
    expect(ports.deleteMarmita).not.toHaveBeenCalled();
  });

  it('should throw ConflictError when marmita has pedidos', async () => {
    const ports = makePorts({ countPedidosByMarmita: vi.fn().mockResolvedValue(2) });
    await expect(deleteMarmita(1, ports)).rejects.toThrow(ConflictError);
    expect(ports.deleteMarmita).not.toHaveBeenCalled();
  });
});
