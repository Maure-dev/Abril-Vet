import { groupRevenueByMonth } from "@app/modules/reports/helpers/groupRevenueByMonth";
import { describe, expect, it } from "vitest";

const sales = [
  { date: "2026-07-05", total: 1000 },
  { date: "2026-07-20", total: 500 },
  { date: "2026-06-10", total: 300 },
  { date: "2026-05-01", total: 0 },
  { date: "", total: 999 }
];

describe("groupRevenueByMonth", () => {
  it("agrupa por mes los últimos N meses incluyendo el de referencia", () => {
    const result = groupRevenueByMonth(sales, "2026-07-15", 3);
    expect(result.map((bucket) => bucket.key)).toEqual(["2026-05", "2026-06", "2026-07"]);
    expect(result.map((bucket) => bucket.total)).toEqual([0, 300, 1500]);
    expect(result[2].label).toBe("jul");
  });

  it("cruza el fin de año hacia atrás", () => {
    const result = groupRevenueByMonth([], "2026-01-10", 3);
    expect(result.map((bucket) => bucket.key)).toEqual(["2025-11", "2025-12", "2026-01"]);
  });
});
