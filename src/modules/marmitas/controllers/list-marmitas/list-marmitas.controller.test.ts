import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import { listMarmitasController } from "./list-marmitas.controller";

vi.mock("../../services/list-marmitas/list-marmitas.service", () => ({
  listMarmitas: vi.fn(),
}));

import { listMarmitas } from "../../services/list-marmitas/list-marmitas.service";

function makeMocks() {
  const req = { query: {} } as unknown as Request;
  const res = { json: vi.fn() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe("listMarmitasController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar res.json com o resultado do service", async () => {
    const fakeResult = {
      data: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
    vi.mocked(listMarmitas).mockResolvedValue(fakeResult);

    const { req, res, next } = makeMocks();
    await listMarmitasController(req, res, next);

    expect(res.json).toHaveBeenCalledWith(fakeResult);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next com o erro quando o service lançar exceção", async () => {
    const error = new Error("falha no banco");
    vi.mocked(listMarmitas).mockRejectedValue(error);

    const { req, res, next } = makeMocks();
    await listMarmitasController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
