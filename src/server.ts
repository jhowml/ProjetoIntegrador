import 'dotenv/config';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Banco de dados conectado.');

    app.listen(env.PORT, () => {
      logger.info(`Servidor rodando em http://localhost:${env.PORT}`);
    });
  } catch (err) {
    logger.error(err, 'Falha ao iniciar o servidor.');
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
