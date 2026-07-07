import { formatDate } from "@app/modules/clients/helpers/formatDate";
import { describe, expect, it } from "vitest";

describe("formatDate", () => {
  it("formatea una fecha yyyy-mm-dd como dd/mm/aaaa", () => {
    expect(formatDate("2026-07-06")).toBe("06/07/2026");
  });

  it("toma sólo la parte de fecha de un datetime ISO", () => {
    expect(formatDate("2026-07-06T14:30")).toBe("06/07/2026");
  });

  it("devuelve un guion si la fecha está vacía", () => {
    expect(formatDate("")).toBe("—");
  });

  it("devuelve el valor original si no tiene forma de fecha", () => {
    expect(formatDate("mañana")).toBe("mañana");
  });
});
