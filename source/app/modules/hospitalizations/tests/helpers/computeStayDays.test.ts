import { computeStayDays } from "@app/modules/hospitalizations/helpers/computeStayDays";
import { describe, expect, it } from "vitest";

const NOW = new Date("2026-07-01T12:00:00");

describe("computeStayDays", () => {
  it("cuenta los días entre ingreso y alta", () => {
    expect(computeStayDays("2026-06-20", "2026-06-25", NOW)).toBe(5);
    expect(computeStayDays("2026-06-20", "2026-06-20", NOW)).toBe(0);
  });

  it("usa `now` cuando no hay alta (null o cadena vacía)", () => {
    expect(computeStayDays("2026-06-20", null, NOW)).toBe(11);
    expect(computeStayDays("2026-06-20", "", NOW)).toBe(11);
    expect(computeStayDays("2026-06-20", "   ", NOW)).toBe(11);
  });

  it("nunca devuelve un número negativo", () => {
    expect(computeStayDays("2026-06-25", "2026-06-20", NOW)).toBe(0);
    expect(computeStayDays("2026-12-01", null, NOW)).toBe(0);
  });

  it("devuelve 0 con fecha de ingreso inválida o ausente", () => {
    expect(computeStayDays("", null, NOW)).toBe(0);
    expect(computeStayDays("no-es-fecha", null, NOW)).toBe(0);
    expect(computeStayDays("2026-13-40", null, NOW)).toBe(0);
  });
});
