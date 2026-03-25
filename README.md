# Marmitas API

API REST em Node.js + TypeScript + Express + Prisma (MySQL) para controle de vendas de marmitas.

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20+** (alinhado ao `@types/node` do projeto)
- [MySQL](https://dev.mysql.com/downloads/) **8** (ou compatível) em execução
- Conta de usuário MySQL com permissão para criar/usar o banco da aplicação

## Passo a passo — ambiente local

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositório>
cd ProjetoIntegrador
npm install
```

### 2. Configurar variáveis de ambiente

Copie o exemplo e ajuste os valores (usuário/senha MySQL, segredo JWT, etc.):

```bash
cp .env.example .env
```

Edite o `.env`:

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta HTTP (padrão `3000`) |
| `NODE_ENV` | `development`, `production` ou `test` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão MySQL (não use `DATABASE_URL`; a URL é montada a partir dessas variáveis) |
| `JWT_SECRET` | Segredo do JWT (**mínimo 10 caracteres**) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (ex.: `7d`) |

### 3. Criar o banco de dados no MySQL

O Prisma aplica apenas as **tabelas**; o **database** precisa existir:

```sql
CREATE DATABASE marmitas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O nome deve coincidir com `DB_NAME` no `.env`.

### 4. Gerar o Prisma Client e aplicar migrations

Os scripts `db:*` leem o `.env` e montam a URL de conexão a partir de `DB_*`.

```bash
npm run db:generate
npm run db:migrate
```

- **`db:migrate`**: modo desenvolvimento (`prisma migrate dev`). Na primeira vez aplica a migration inicial.
- Em produção/CI, use **`npm run db:migrate:deploy`** (`prisma migrate deploy`).

### 5. (Opcional) Popular dados iniciais

```bash
npm run db:seed
```

### 6. Subir a API

Desenvolvimento (recarrega ao alterar código):

```bash
npm run dev
```

Produção (compilar e rodar):

```bash
npm run build
npm start
```

### 7. Verificar se está no ar

```bash
curl -sS "http://localhost:3000/health"
```

Resposta esperada: `{"status":"ok"}` (ajuste a porta se mudou `PORT` no `.env`).

Exemplo de rota da API:

```bash
curl -sS "http://localhost:3000/api/marmitas"
```

## Outros comandos úteis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Testes com Vitest |
| `npm run test:coverage` | Testes com cobertura |
| `npm run db:studio` | Abre o Prisma Studio no navegador |

## DBeaver / clientes SQL

Use o database indicado em `DB_NAME` na URL ou como schema padrão (ex.: `jdbc:mysql://localhost:3306/marmitas_db`). Conectar só em `localhost:3306/` sem nome do banco não mostra as tabelas do projeto.

## Problemas comuns

- **`EACCES` em `node_modules/.prisma`**: permissões na pasta `node_modules`; corrija o dono da pasta ou reinstale dependências com o usuário correto.
- **Migration “já aplicada” mas sem tabelas**: confira se está conectado ao mesmo `DB_NAME` do `.env` e rode `SHOW TABLES` nesse banco.
