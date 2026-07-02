import { toBarPercents } from "@app/modules/reports/helpers/toBarPercents";
import { describe, expect, it } from "vitest";

describe("toBarPercents", () => {
  it("expresa cada valor como % del máximo (el mayor queda en 100)", () => {
    expect(toBarPercents([10, 5, 0])).toEqual([100, 50, 0]);
  });

  it("devuelve todos 0 cuando el máximo es 0", () => {
    expect(toBarPercents([0, 0, 0])).toEqual([0, 0, 0]);
  });

  it("redondea a entero", () => {
    expect(toBarPercents([3, 10])).toEqual([30, 100]);
    expect(toBarPercents([1, 3])).toEqual([33, 100]);
  });

  it("con lista vacía devuelve lista vacía", () => {
    expect(toBarPercents([])).toEqual([]);
  });

  it("un único valor positivo queda en 100", () => {
    expect(toBarPercents([42])).toEqual([100]);
  });
});
