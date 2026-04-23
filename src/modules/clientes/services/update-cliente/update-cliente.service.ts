import { NotFoundError } from '@/shared/errors/AppError';
import { UpdateClienteBodyDTO } from '@/modules/clientes/dtos/update-cliente/update-cliente.types';
import { findClienteById, updateCliente as updateClienteRepository } from '@/modules/clientes/repositories/cliente.repository';

export async function updateCliente(id: number, data: UpdateClienteBodyDTO) {
  const existing = await findClienteById(id);
  if (!existing) throw new NotFoundError('Cliente');

  return updateClienteRepository(id, data);
}
