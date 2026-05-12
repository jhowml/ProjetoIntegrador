import { z } from 'zod';
import { buildDatabaseUrl } from './buildDatabaseUrl';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),
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

function getDatabaseUrl(): string {
  if (data.DATABASE_URL) return data.DATABASE_URL;
  if (data.DB_HOST && data.DB_USER && data.DB_NAME) {
    return buildDatabaseUrl({
      host: data.DB_HOST,
      port: data.DB_PORT,
      user: data.DB_USER,
      password: data.DB_PASSWORD ?? '',
      database: data.DB_NAME,
    });
  }
  console.error('Configure DATABASE_URL ou as variáveis DB_HOST, DB_USER, DB_PASSWORD e DB_NAME');
  process.exit(1);
}

export const env = {
  ...data,
  databaseUrl: getDatabaseUrl(),
};
