import 'dotenv/config';
import request from 'supertest';
import { app } from '../src/app';

async function main() {
  const health = await request(app).get('/health');
  console.log('GET /health', health.status, health.body);

  const clienteRes = await request(app).post('/api/clientes').send({
    nome: 'Cliente smoke pedido',
    endereco: 'Rua Smoke 100',
    telefone: '11988887777',
  });
  console.log('POST /api/clientes', clienteRes.status, JSON.stringify(clienteRes.body));

  const marmitasRes = await request(app).get('/api/marmitas?page=1&pageSize=5');
  console.log('GET /api/marmitas', marmitasRes.status, 'total', marmitasRes.body?.meta?.total);

  if (clienteRes.status !== 201 || marmitasRes.status !== 200) {
    console.error('Pré-requisitos falharam; não é possível criar pedido.');
    process.exit(1);
  }

  const clienteId = clienteRes.body.idClientes;
  const primeira = marmitasRes.body?.data?.[0];
  if (!primeira?.idMarmita) {
    console.error('Nenhuma marmita na base. Rode: npm run db:seed');
    process.exit(1);
  }

  const pedidoOk = await request(app).post('/api/pedidos').send({
    clienteId,
    marmitaId: primeira.idMarmita,
    quantidadeMarmitas: 2,
  });
  console.log('POST /api/pedidos (válido)', pedidoOk.status, JSON.stringify(pedidoOk.body));

  const pedido404Cliente = await request(app).post('/api/pedidos').send({
    clienteId: 999_999,
    marmitaId: primeira.idMarmita,
    quantidadeMarmitas: 1,
  });
  console.log('POST /api/pedidos (cliente inexistente)', pedido404Cliente.status, JSON.stringify(pedido404Cliente.body));

  const pedido422 = await request(app).post('/api/pedidos').send({
    clienteId: 0,
    marmitaId: primeira.idMarmita,
    quantidadeMarmitas: 1,
  });
  console.log('POST /api/pedidos (validação)', pedido422.status, JSON.stringify(pedido422.body));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
