import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { buildMysqlDatabaseUrl } from '../src/config/buildDatabaseUrl';

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD ?? '';
const database = process.env.DB_NAME;
const port = Number(process.env.DB_PORT ?? 3306);

if (!host || !user || !database) {
  console.error('Defina DB_HOST, DB_USER, DB_NAME e DB_PASSWORD no .env');
  process.exit(1);
}

process.env.DATABASE_URL = buildMysqlDatabaseUrl({
  host,
  port,
  user,
  password,
  database,
});

const prismaArgs = process.argv.slice(2);
const result = spawnSync('npx', ['prisma', ...prismaArgs], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
