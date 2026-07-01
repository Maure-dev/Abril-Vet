import { computeAge } from "@app/modules/patients/helpers/computeAge";
import { describe, expect, it } from "vitest";

const NOW = new Date("2026-07-01T12:00:00");

describe("computeAge", () => {
  it("devuelve '' si no hay fecha o es inválida", () => {
    expect(computeAge(null, NOW)).toBe("");
    expect(computeAge("", NOW)).toBe("");
    expect(computeAge("no-es-fecha", NOW)).toBe("");
  });

  it("devuelve '' si la fecha es futura", () => {
    expect(computeAge("2030-01-01", NOW)).toBe("");
  });

  it("calcula años y meses", () => {
    expect(computeAge("2023-05-01", NOW)).toBe("3 años y 2 meses");
    expect(computeAge("2025-07-01", NOW)).toBe("1 año");
  });

  it("usa singular y el caso 'menos de 1 mes'", () => {
    expect(computeAge("2025-06-01", NOW)).toBe("1 año y 1 mes");
    expect(computeAge("2026-06-20", NOW)).toBe("Menos de 1 mes");
  });
});
