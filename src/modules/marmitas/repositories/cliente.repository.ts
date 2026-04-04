import { Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { paginate } from '@/shared/types/pagination';
import { ListClientesDTO } from '@/modules/marmitas/dtos/list-clientes/list-cientes.types';
import { CreateClienteDTO } from '@/modules/marmitas/dtos/create-clients/create-cliente.types';

export async function listclientes(query: ListClientesDTO) {
  const { take, skip } = paginate(query.page, query.pageSize);

  const where: Prisma.MarmitaWhereInput = {
    ...(query.search && { descricao: { contains: query.search } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.cliente.findMany({ where, take, skip, orderBy: { nome: 'asc' } }),
    prisma.cliente.count({ where }),
  ]);

  return { data, total };
}

export async function createCliente(data: CreateClienteDTO) {
  return prisma.cliente.create({ data });}