import { Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { paginate } from '@/shared/types/pagination';
import { ListClientesDTO } from '@/modules/clientes/dtos/list-clientes/list-clientes.types';
import { CreateClienteDTO } from '@/modules/clientes/dtos/create-cliente/create-cliente.types';
import { UpdateClienteBodyDTO } from '@/modules/clientes/dtos/update-cliente/update-cliente.types';

export async function listclientes(query: ListClientesDTO) {
  const { take, skip } = paginate(query.page, query.pageSize);

  const where: Prisma.ClienteWhereInput = {
    deletedAt: null,
    ...(query.search && { nome: { contains: query.search, mode: 'insensitive' } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.cliente.findMany({ where, take, skip, orderBy: { nome: 'asc' } }),
    prisma.cliente.count({ where }),
  ]);

  return { data, total };
}

export async function createCliente(data: CreateClienteDTO) {
  return prisma.cliente.create({ data });
}

export async function findClienteById(id: number) {
  return prisma.cliente.findFirst({ where: { idClientes: id, deletedAt: null } });
}

export async function updateCliente(id: number, data: UpdateClienteBodyDTO) {
  return prisma.cliente.update({ where: { idClientes: id }, data });
}

export async function countPedidosByCliente(id: number) {
  return prisma.pedido.count({ where: { clientesIdClientes: id } });
}

export async function deleteCliente(id: number) {
  return prisma.cliente.update({ where: { idClientes: id }, data: { deletedAt: new Date() } });
}
