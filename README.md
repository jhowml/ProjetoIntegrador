# Marmitas API

API REST em Node.js + TypeScript + Express + Prisma (PostgreSQL) para controle de vendas de marmitas.

---

## Sumário

- [Infraestrutura](#infraestrutura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente local](#configuração-do-ambiente-local)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Domínio](#domínio)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Outros comandos úteis](#outros-comandos-úteis)
- [Problemas comuns](#problemas-comuns)

---

## Infraestrutura

| Camada | Serviço | Plano |
|--------|---------|-------|
| **Backend** | [Render](https://render.com) — Web Service | Free |
| **Frontend** | [Vercel](https://vercel.com) | Hobby (Free) |
| **Banco de dados** | [Neon](https://neon.tech) — PostgreSQL serverless | Free |

### Variáveis de ambiente — Render (produção)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string completa do Neon (incluindo `sslmode=require`) |
| `JWT_SECRET` | Segredo do JWT (**mínimo 10 caracteres**) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (ex.: `7d`) |
| `APP_USERNAME` | Usuário de acesso à aplicação |
| `APP_PASSWORD` | Senha de acesso à aplicação |
| `ALLOWED_ORIGINS` | Origens permitidas no CORS — inclua a URL do frontend no Vercel (ex.: `https://seu-projeto.vercel.app`) |
| `NODE_ENV` | `production` |

> Use `DATABASE_URL` com a string completa do Neon em produção. As variáveis `DB_*` individuais são para ambiente local.

### Variáveis de ambiente — Vercel (produção)

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base do backend no Render (ex.: `https://seu-projeto.onrender.com`) |

### Build e deploy

**Render — Build Command:**
```
npm install && npm run build && npx tsx scripts/prisma-env.ts migrate resolve --rolled-back 20250325120000_init_schema; npm run db:migrate:deploy
```

**Render — Start Command:**
```
npm start
```

O `postinstall` regenera o Prisma Client automaticamente a cada deploy (`prisma generate`).

### Health check

```bash
GET /health
# {"status":"ok","db":"ok"}
```

Responde `503` se o banco estiver inacessível.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20+**
- Instância PostgreSQL acessível (local ou remota)

---

## Configuração do ambiente local

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositório>
cd ProjetoIntegrador
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta HTTP (padrão `3000`) |
| `NODE_ENV` | `development`, `production` ou `test` |
| `DATABASE_URL` | Connection string completa (preferencial para Neon/produção) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Alternativa ao `DATABASE_URL` para conexão local |
| `ALLOWED_ORIGINS` | Origens permitidas no CORS (padrão: `http://localhost:3000,http://localhost:3001`) |
| `JWT_SECRET` | Segredo do JWT (**mínimo 10 caracteres**) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (ex.: `7d`) |
| `APP_USERNAME` | Usuário de acesso à aplicação |
| `APP_PASSWORD` | Senha de acesso à aplicação |

> Se `DATABASE_URL` estiver definida, as variáveis `DB_*` são ignoradas.

### 3. Aplicar migrations e gerar o Prisma Client

```bash
npm run db:migrate
```

### 4. (Opcional) Popular dados iniciais

```bash
npm run db:seed
```

Insere as 4 marmitas padrão (P, M, G e Fit) na tabela `Marmitas`.

### 5. Subir a API

Desenvolvimento (hot reload):

```bash
npm run dev
```

Produção:

```bash
npm run build
npm start
```

### 6. Verificar se está no ar

```bash
curl -sS "http://localhost:3000/health"
# {"status":"ok","db":"ok"}
```

---

## Arquitetura

A aplicação segue uma **arquitetura em camadas** organizada por módulos de funcionalidade. Cada módulo contém todas as suas camadas internamente.

```
Requisição HTTP
  └─► Router
        └─► Controller   — parse e validação da entrada, retorno da resposta
              └─► Service     — regras de negócio e orquestração
                    └─► Repository  — acesso a dados (Prisma)
                          └─► PostgreSQL
```

**Princípios aplicados:**

- **Controllers** não contêm lógica de negócio — delegam tudo ao service.
- **Services** não conhecem Express, `req` ou `res`.
- **Repositories** concentram todas as queries Prisma — nenhuma query fora dessa camada.
- Erros de domínio são lançados via subclasses de `AppError` e capturados pelo middleware global.

---

## Estrutura de pastas

```
src/
├── config/               # Configurações globais (env, banco, logger)
├── modules/              # Um diretório por entidade de domínio
│   ├── marmitas/
│   │   ├── controllers/  # Handlers HTTP
│   │   ├── services/     # Regras de negócio
│   │   ├── repositories/ # Queries Prisma
│   │   └── dtos/         # Schemas Zod + tipos TypeScript
│   └── clientes/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       └── dtos/
├── shared/
│   ├── errors/           # AppError e subclasses tipadas
│   ├── middleware/       # Middleware Express (errorHandler, etc.)
│   └── types/            # Tipos compartilhados (paginação, etc.)
├── app.ts                # Configuração do Express
└── server.ts             # Entrada — inicializa servidor e shutdown gracioso

prisma/
├── schema.prisma         # Modelo de dados
├── seed.ts               # Dados de desenvolvimento
└── migrations/           # SQL versionado
```

---

## Domínio

### Entidades

| Entidade | Descrição |
|---|---|
| **Marmita** | Produto vendido; possui `descricao`, `precoBase`, `adicionalEmbalagem` e `peso` |
| **Cliente** | Comprador; possui `nome`, `telefone`, `endereco` e `obs` |
| **Pedido** | Vínculo entre cliente e marmitas; suporta múltiplos itens via `PedidoItens` |
| **PedidoItem** | Item de um pedido — referencia uma marmita com quantidade e preço unitário |
| **Pagamento** | Associado 1-para-1 a um pedido |

### Status do Pedido

```
PENDENTE → CONFIRMADO → PREPARANDO → ENTREGUE
                                   ↘ CANCELADO
```

### Tipos de Pagamento

`DINHEIRO` · `CARTAO_CREDITO` · `CARTAO_DEBITO` · `PIX`

### Status do Pagamento

`PENDENTE` · `PAGO` · `ESTORNADO`

---

## Endpoints

### Health check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Verifica API e conectividade com o banco |

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/login` | Autentica e retorna JWT |

### Marmitas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/marmitas` | Lista marmitas com paginação e busca |
| `POST` | `/api/marmitas` | Cria uma nova marmita |

**Parâmetros de query — `GET /api/marmitas`:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | number | `1` | Página atual |
| `pageSize` | number | `20` | Itens por página (máx. `100`) |
| `search` | string | — | Filtro por descrição |

---

### Clientes

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/clientes` | Lista clientes com paginação e busca |
| `POST` | `/api/clientes` | Cria um novo cliente |
| `PUT` | `/api/clientes/:id` | Atualiza dados de um cliente |
| `DELETE` | `/api/clientes/:id` | Remove um cliente |

---

### Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/pedidos` | Lista pedidos com paginação e filtros |
| `POST` | `/api/pedidos` | Cria um novo pedido |
| `PUT` | `/api/pedidos/:id` | Atualiza um pedido |
| `DELETE` | `/api/pedidos/:id` | Remove um pedido |

**Body — `POST /api/pedidos`:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `clienteId` | number | sim | ID do cliente |
| `itens` | array | sim | Lista de itens (mínimo 1) |
| `itens[].marmitaId` | number | sim | ID da marmita |
| `itens[].quantidade` | number | sim | Quantidade |
| `dataEntrega` | date | não | Data de entrega |

---

## Testes

```bash
npm test                 # Roda os testes unitários (Vitest)
npm run test:coverage    # Gera relatório de cobertura
```

Os testes ficam junto ao arquivo testado (`<nome>.test.ts`). São cobertos por testes: **services** e **controllers**.

---

## Outros comandos úteis

| Comando | Descrição |
|---------|-----------|
| `npm run db:studio` | Abre o Prisma Studio no navegador |
| `npm run db:generate` | Regenera o Prisma Client após mudanças no schema |
| `npm run db:seed` | Popula dados iniciais |

---

## Problemas comuns

- **`EACCES` em `node_modules/.prisma`**: problema de permissões na pasta; corrija o dono da pasta ou reinstale as dependências com o usuário correto.
- **Migration com SQL MySQL em banco PostgreSQL**: as migrations antigas usavam backticks (sintaxe MySQL). A migration atual (`20260513000000_init`) já está em PostgreSQL correto.
- **Migration marcada como falha no banco**: execute `npx tsx scripts/prisma-env.ts migrate resolve --rolled-back <nome-da-migration>` para desmarcar, depois rode `npm run db:migrate:deploy`.
- **`Cannot find module '@/...'` em runtime**: o build deve usar `tsc && tsc-alias` para reescrever os aliases de caminho no JS compilado.
