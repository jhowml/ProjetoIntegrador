import { CreateClienteDTO } from '@/modules/marmitas/dtos/create-clients/create-cliente.types';
import { createCliente as createClienteRepository } from '@/modules/marmitas/repositories/cliente.repository';

export async function createCliente(data: CreateClienteDTO) {
  return createClienteRepository(data);
}
