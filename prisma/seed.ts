import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { buildMysqlDatabaseUrl } from '../src/config/buildDatabaseUrl';

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD ?? '';
const database = process.env.DB_NAME;
const port = Number(process.env.DB_PORT ?? 3306);

if (!host || !user || !database) {
  throw new Error('Defina DB_HOST, DB_USER, DB_NAME (e DB_PASSWORD) no .env para o seed.');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: buildMysqlDatabaseUrl({ host, port, user, password, database }),
    },
  },
});

async function main() {
  await prisma.marmita.createMany({
    skipDuplicates: true,
    data: [
      { descricao: 'Marmita P - Arroz, feijão, 1 proteína', precoBase: 12.9, adicionalEmbalagem: 0.5, peso: 0.30 },
      { descricao: 'Marmita M - Arroz, feijão, 2 proteínas', precoBase: 16.9, adicionalEmbalagem: 0.5, peso: 0.45 },
      { descricao: 'Marmita G - Arroz, feijão, 3 proteínas', precoBase: 20.9, adicionalEmbalagem: 0.5, peso: 0.60 },
      { descricao: 'Marmita Fit - Arroz integral, grelhado, salada', precoBase: 18.9, adicionalEmbalagem: 0.5, peso: 0.40 },
    ],
  });

  console.log('Seed concluído.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
