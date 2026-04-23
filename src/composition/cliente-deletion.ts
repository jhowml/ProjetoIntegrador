import {
  findClienteById,
  countPedidosByCliente,
  deleteCliente as deleteClienteRepository,
} from '@/modules/clientes/repositories/cliente.repository';
import { deleteCliente as deleteClienteService } from '@/modules/clientes/services/delete-cliente/delete-cliente.service';
import type { DeleteClientePorts } from './cliente-deletion.ports';

const deleteClientePorts: DeleteClientePorts = {
  findClienteById,
  countPedidosByCliente,
  deleteCliente: deleteClienteRepository,
};

export async function deleteCliente(id: number) {
  return deleteClienteService(id, deleteClientePorts);
}
