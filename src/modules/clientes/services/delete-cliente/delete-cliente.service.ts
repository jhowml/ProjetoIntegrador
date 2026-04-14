import { NotFoundError } from '@/shared/errors/AppError';
import { findClienteById, deleteCliente as deleteClienteRepository } from '@/modules/clientes/repositories/cliente.repository';

export async function deleteCliente(id: number) {
  const existing = await findClienteById(id);
  if (!existing) throw new NotFoundError('Cliente');

  await deleteClienteRepository(id);
}
