import { filterCashSessions } from "@app/modules/cashRegister/helpers/filterCashSessions";
import { buildCashSession } from "@app/modules/cashRegister/tests/factories";
import { describe, expect, it } from "vitest";

const open = buildCashSession({ id: "1", status: "open", openedAt: "2026-07-01T09:00:00.000Z" });
const closed = buildCashSession({
  id: "2",
  status: "closed",
  openedAt: "2026-06-30T09:00:00.000Z",
  closedAt: "2026-06-30T20:00:00.000Z",
  notes: "Cierre sin novedades"
});

describe("filterCashSessions", () => {
  it("sin query ni filtro devuelve todas", () => {
    expect(filterCashSessions([open, closed], "", "all")).toHaveLength(2);
  });

  it("filtra por estado", () => {
    expect(filterCashSessions([open, closed], "", "closed")).toEqual([closed]);
  });

  it("busca por fecha o notas (case-insensitive)", () => {
    expect(filterCashSessions([open, closed], "2026-06-30", "all")).toEqual([closed]);
    expect(filterCashSessions([open, closed], "novedades", "all")).toEqual([closed]);
  });
});
