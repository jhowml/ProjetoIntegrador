# Marmitas API

API REST em Node.js + TypeScript + Express + Prisma (MySQL) para controle de vendas de marmitas.

---

## Sumário

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

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20+**
- [MySQL](https://dev.mysql.com/downloads/) **8+** em execução
- Conta de usuário MySQL com permissão para criar/usar o banco da aplicação

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
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão MySQL — a URL é montada internamente a partir dessas variáveis; não use `DATABASE_URL` diretamente |
| `JWT_SECRET` | Segredo do JWT (**mínimo 10 caracteres**) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (ex.: `7d`) |

### 3. Criar o banco de dados no MySQL

O Prisma aplica apenas as **tabelas**; o **database** precisa existir antes:

```sql
CREATE DATABASE marmitas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O nome deve coincidir com `DB_NAME` no `.env`.

### 4. Gerar o Prisma Client e aplicar migrations

```bash
npm run db:generate
npm run db:migrate
```

- **`db:migrate`** — modo desenvolvimento (`prisma migrate dev`); na primeira execução aplica a migration inicial.
- Em produção/CI, use **`npm run db:migrate:deploy`** (`prisma migrate deploy`).

### 5. (Opcional) Popular dados iniciais

```bash
npm run db:seed
```

Insere as 4 marmitas padrão (P, M, G e Fit) na tabela `Marmitas`.

### 6. Subir a API

Desenvolvimento (hot reload):

```bash
npm run dev
```

Produção:

```bash
npm run build
npm start
```

### 7. Verificar se está no ar

```bash
curl -sS "http://localhost:3000/health"
# {"status":"ok"}

curl -sS "http://localhost:3000/api/marmitas"
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
                          └─► MySQL
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
│   └── <módulo>/
│       ├── controllers/  # Handlers HTTP
│       ├── services/     # Regras de negócio
│       ├── repositories/ # Queries Prisma
│       └── dtos/         # Schemas Zod + tipos TypeScript
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
| **Pedido** | Vínculo entre cliente e marmita; registra `quantidadeMarmitas` e `valorTotal` |
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
| `GET` | `/health` | Verifica se a API está no ar |

### Marmitas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/marmitas` | Lista marmitas com paginação e busca |

**Parâmetros de query — `GET /api/marmitas`:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | number | `1` | Página atual |
| `limit` | number | `20` | Itens por página (máx. `100`) |
| `search` | string | — | Filtro por descrição |

**Resposta:**

```json
{
  "data": [
    {
      "idMarmita": 1,
      "descricao": "Marmita P",
      "precoBase": "12.00",
      "adicionalEmbalagem": "0.50",
      "peso": "300.00"
    }
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

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

### DBeaver / clientes SQL

Use o database definido em `DB_NAME` na string de conexão (ex.: `jdbc:mysql://localhost:3306/marmitas_db`). Conectar apenas em `localhost:3306/` sem informar o banco não exibe as tabelas do projeto.

---

## Problemas comuns

- **`EACCES` em `node_modules/.prisma`**: problema de permissões na pasta; corrija o dono da pasta ou reinstale as dependências com o usuário correto.
- **Migration "já aplicada" mas sem tabelas**: confirme que está conectado ao mesmo `DB_NAME` definido no `.env` e execute `SHOW TABLES` nesse banco.
- **`DATABASE_URL` não encontrada**: não defina essa variável — a URL é montada automaticamente a partir das variáveis `DB_*`.
