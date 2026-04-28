import { Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { paginate } from '@/shared/types/pagination';
import { ListMarmitasDTO } from '@/modules/marmitas/dtos/list-marmitas/list-marmitas.types';
import { CreateMarmitaDTO } from '@/modules/marmitas/dtos/create-marmita/create-marmita.types';
import { UpdateMarmitaBodyDTO } from '@/modules/marmitas/dtos/update-marmita/update-marmita.types';

export async function listMarmitas(query: ListMarmitasDTO) {
  const { take, skip } = paginate(query.page, query.pageSize);

  const where: Prisma.MarmitaWhereInput = {
    ...(query.search && { descricao: { contains: query.search } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.marmita.findMany({ where, take, skip, orderBy: { descricao: 'asc' } }),
    prisma.marmita.count({ where }),
  ]);

  return { data, total };
}

export async function createMarmita(data: CreateMarmitaDTO) {
  return prisma.marmita.create({ data });
}

export async function findMarmitaById(id: number) {
  return prisma.marmita.findUnique({ where: { idMarmita: id } });
}

export async function updateMarmita(id: number, data: UpdateMarmitaBodyDTO) {
  return prisma.marmita.update({ where: { idMarmita: id }, data });
}

export async function countPedidosByMarmita(id: number) {
  return prisma.pedido.count({ where: { marmitasIdMarmita: id } });
}

export async function deleteMarmita(id: number) {
  return prisma.marmita.delete({ where: { idMarmita: id } });
}
