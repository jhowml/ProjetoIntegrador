# CLAUDE.md

This file documents the architecture, conventions, and structure of the project for Claude Code and any contributors.

## Language conventions

- **Project code and this file:** English (variable names, function names, folder names, comments, layer names).
- **Domain terms:** pt-BR, matching the database schema (e.g. `marmita`, `cliente`, `pedido`, `pagamento`).
- **Documents intended for other people** (README, API docs, user-facing content): always **pt-BR**.

## Project Overview

REST API for managing **marmita** (pre-prepared meal) sales — handling **clientes**, **pedidos**, and **pagamentos**.

**Stack:** Node.js · TypeScript · Express · Prisma · MySQL · Vitest

---

## Architecture

The project follows a **layered architecture** organized by feature modules. Each module owns all its layers internally.

```
Request
  └─► Router
        └─► Controller   (HTTP layer)
              └─► Service     (business logic)
                    └─► Repository  (data access)
                          └─► Prisma / MySQL
```

---

## Folder Structure

```
src/
├── config/               # App-wide configuration (env, database, logger)
├── modules/              # Feature modules — one folder per domain entity
│   └── <module>/
│       ├── controllers/  # HTTP handlers — parse input, call service, return response
│       ├── services/     # Business rules — orchestrates repositories, applies logic
│       ├── repositories/ # Data access — all Prisma queries live here
│       └── dtos/         # Zod schemas + TypeScript types for request/response shapes
├── shared/
│   ├── errors/           # AppError base class and typed error subclasses
│   ├── middleware/       # Express middleware (error handler, auth, etc.)
│   └── types/            # Shared TypeScript types (e.g., pagination)
├── app.ts                # Express app setup — registers middleware and routes
└── server.ts             # Entry point — starts HTTP server, handles graceful shutdown

prisma/
├── schema.prisma         # Data model
├── seed.ts               # Seeds development data
└── migrations/           # Versioned migration SQL files
```

### Module naming

Modules are named after the domain entity they own, in **pt-BR**, matching the database table names:

| Module folder | Domain entity |
|---|---|
| `marmitas` | Marmita (produto vendido) |
| `clientes` | Cliente |
| `pedidos` | Pedido |
| `pagamentos` | Pagamento |

---

## Layer Responsibilities

### Controller

- Lives in `modules/<module>/controllers/<action>/`
- Parses and validates HTTP input (query params, body) using the DTO schema
- Calls a single service method
- Returns the HTTP response with the appropriate status code
- **Does not contain business logic**

### Service

- Lives in `modules/<module>/services/<action>/`
- Contains all business rules for the use case
- Calls one or more repository methods
- Throws `AppError` subclasses on domain violations
- **Does not import from Express or interact with HTTP primitives**

### Repository

- Lives in `modules/<module>/repositories/`
- One file per domain entity (e.g., `marmita.repository.ts`)
- All Prisma queries are concentrated here
- Returns plain data objects — no business logic, no HTTP concerns

### DTO

- Lives in `modules/<module>/dtos/<action>/`
- Two files per action:
  - `<action>.dto.ts` — Zod schema for validation
  - `<action>.types.ts` — TypeScript types inferred from the schema

### Shared

| Path | Purpose |
|---|---|
| `shared/errors/AppError.ts` | Base error class; subclasses: `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError` |
| `shared/middleware/errorHandler.middleware.ts` | Global Express error handler; formats `AppError` and Zod errors |
| `shared/types/pagination.ts` | `paginate()` helper and `buildPaginatedResult()` — used across all list endpoints |

---

## Domain Entities

All entity names in **pt-BR** (matching the database schema):

- **Marmita** — produto vendido; possui `descricao`, `precoBase`, `adicionalEmbalagem`, `peso`
- **Cliente** — comprador; possui `nome`, `telefone`, `endereco`, `obs`
- **Pedido** — vínculo entre cliente e marmita; status: `PENDENTE → CONFIRMADO → PREPARANDO → ENTREGUE | CANCELADO`
- **Pagamento** — associado 1-para-1 a um pedido; tipos: `DINHEIRO`, `CARTAO_CREDITO`, `CARTAO_DEBITO`, `PIX`; status: `PENDENTE`, `PAGO`, `ESTORNADO`
- **User** — usuário do sistema (autenticação)

---

## Key Conventions

### File naming

- All files use **kebab-case**
- Action-specific files are nested in a folder with the same name as the action:
  ```
  controllers/list-marmitas/list-marmitas.controller.ts
  controllers/list-marmitas/list-marmitas.controller.test.ts
  ```

### Error handling

Throw typed errors from `shared/errors/`; the global middleware handles formatting:

```ts
throw new NotFoundError('Marmita not found')
```

Never send raw `res.status(500).json(...)` from inside services or repositories.

### Validation

All request input is validated with Zod at the **controller** level before reaching the service. Use `schema.parse()` — not `.safeParse()` — so that validation errors bubble up to the global handler automatically.

### Pagination

All list endpoints use `paginate()` + `buildPaginatedResult()` from `shared/types/pagination.ts`.

Default: `page=1`, `limit=20`. Max limit: `100`.

Response shape:
```json
{
  "data": [...],
  "meta": { "total": 0, "page": 1, "limit": 20, "totalPages": 0 }
}
```

### Path aliases

Use the `@/` alias for imports instead of relative paths:

```ts
import { AppError } from '@/shared/errors/AppError'
```

---

## Configuration

### Environment variables

Defined and validated in `src/config/env.ts` using Zod. The app **will not start** if required variables are missing.

Database connection is assembled from individual variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) by `src/config/buildDatabaseUrl.ts` — `DATABASE_URL` is **not** stored in `.env`.

### Logging

Pino via `src/config/logger.ts`:
- `development` → debug level, pretty output
- `production` → info level, JSON output

HTTP requests are logged automatically by `pino-http`.

---

## Scripts

```
npm run dev               # Start dev server with hot reload (tsx watch)
npm run build             # Compile TypeScript to dist/
npm start                 # Run compiled output (production)
npm test                  # Run unit tests with Vitest
npm run test:coverage     # Generate coverage report

npm run db:generate       # Regenerate Prisma client after schema changes
npm run db:migrate        # Apply migrations (development)
npm run db:migrate:deploy # Apply migrations (production / CI)
npm run db:studio         # Open Prisma Studio
npm run db:seed           # Seed database with sample data
```

---

## Testing

Framework: **Vitest** + **Supertest**

- Unit tests live alongside the file they test: `<name>.test.ts`
- Test both the **service** and **controller** layers
- Mock dependencies at module boundaries (mock the repository when testing the service; mock the service when testing the controller)
- Run `npm test` before pushing
