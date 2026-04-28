import { z } from 'zod';
import { buildMysqlDatabaseUrl } from './buildDatabaseUrl';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),
  APP_USERNAME: z.string().min(1),
  APP_PASSWORD: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const data = parsed.data;

export const env = {
  ...data,
  databaseUrl: buildMysqlDatabaseUrl({
    host: data.DB_HOST,
    port: data.DB_PORT,
    user: data.DB_USER,
    password: data.DB_PASSWORD,
    database: data.DB_NAME,
  }),
};
