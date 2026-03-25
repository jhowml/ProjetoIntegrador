import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import { paginate } from '../../../shared/types/pagination';
import { ListMarmitasDTO } from '../dtos/list-marmitas/list-marmitas.dto';

export async function listMarmitas(query: ListMarmitasDTO) {
  const { take, skip } = paginate(query.page, query.limit);

  const where: Prisma.MarmitaWhereInput = {
    ...(query.search && { descricao: { contains: query.search } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.marmita.findMany({ where, take, skip, orderBy: { descricao: 'asc' } }),
    prisma.marmita.count({ where }),
  ]);

  return { data, total };
}
