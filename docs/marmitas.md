# API de Marmitas

**Base URL:** `/api/marmitas`

---

## Modelo

| Campo                | Tipo     | Descrição                             |
|----------------------|----------|---------------------------------------|
| `idMarmita`          | `number` | Identificador único                   |
| `descricao`          | `string` | Descrição da marmita (máx. 255 chars) |
| `precoBase`          | `number` | Preço base (decimal, positivo)        |
| `adicionalEmbalagem` | `number` | Adicional de embalagem (0.00 – 0.99)  |
| `peso`               | `number` | Peso em kg (positivo)                 |

---

## Endpoints

### `GET /api/marmitas` — Listar marmitas

**Query params:**

| Parâmetro  | Tipo     | Obrigatório | Padrão | Descrição                                          |
|------------|----------|-------------|--------|----------------------------------------------------|
| `page`     | `number` | não         | `1`    | Número da página                                   |
| `pageSize` | `number` | não         | `20`   | Itens por página (máx. `100`)                      |
| `search`   | `string` | não         | —      | Filtra por `descricao` (contains, case-insensitive) |

**Resposta `200`:**

```json
{
  "data": [
    {
      "idMarmita": 1,
      "descricao": "Marmita Frango Grelhado",
      "precoBase": "18.50",
      "adicionalEmbalagem": "0.50",
      "peso": "0.80"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### `POST /api/marmitas` — Criar marmita

**Body (JSON):**

| Campo                | Tipo     | Obrigatório | Validação                   |
|----------------------|----------|-------------|-----------------------------|
| `descricao`          | `string` | sim         | mín. 1, máx. 255 chars      |
| `precoBase`          | `number` | sim         | positivo                    |
| `adicionalEmbalagem` | `number` | sim         | `0.00` a `0.99` (inclusive) |
| `peso`               | `number` | sim         | positivo                    |

**Exemplo de body:**

```json
{
  "descricao": "Marmita Frango Grelhado",
  "precoBase": 18.50,
  "adicionalEmbalagem": 0.50,
  "peso": 0.80
}
```

**Resposta `201`:** objeto `Marmita` criado.

---

### `PUT /api/marmitas/:id` — Atualizar marmita

**Path param:** `id` — número inteiro positivo.

**Body (JSON):** todos os campos são opcionais, mas **pelo menos um** deve ser informado.

| Campo                | Tipo     | Validação                   |
|----------------------|----------|-----------------------------|
| `descricao`          | `string` | mín. 1, máx. 255 chars      |
| `precoBase`          | `number` | positivo                    |
| `adicionalEmbalagem` | `number` | `0.00` a `0.99` (inclusive) |
| `peso`               | `number` | positivo                    |

**Resposta `200`:** objeto `Marmita` atualizado.

**Erros:**

| Status | Código               | Condição                            |
|--------|----------------------|-------------------------------------|
| `404`  | `NOT_FOUND`          | Marmita com o `id` não existe       |
| `422`  | `VALIDATION_ERROR`   | Body vazio ou campos inválidos      |

---

### `DELETE /api/marmitas/:id` — Deletar marmita

**Path param:** `id` — número inteiro positivo.

**Resposta `204`:** sem corpo.

**Erros:**

| Status | Código        | Condição                                  |
|--------|---------------|-------------------------------------------|
| `404`  | `NOT_FOUND`   | Marmita com o `id` não existe             |
| `409`  | `CONFLICT`    | Marmita possui pedidos e não pode ser removida |

---

## Erros comuns (todos os endpoints)

**Formato de erro:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "fields": {
      "precoBase": ["Expected number, received string"]
    }
  }
}
```

| Status | Código           | Causa                       |
|--------|------------------|-----------------------------|
| `404`  | `NOT_FOUND`      | Recurso não encontrado      |
| `422`  | `VALIDATION_ERROR` | Falha na validação Zod    |
| `500`  | `INTERNAL_ERROR` | Erro inesperado no servidor |
