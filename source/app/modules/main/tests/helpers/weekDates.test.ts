import { addDays, startOfWeek, weekDays } from "@app/modules/main/helpers/weekDates";
import { describe, expect, it } from "vitest";

describe("weekDates", () => {
  it("addDays suma y resta días cruzando meses", () => {
    expect(addDays("2026-07-02", 1)).toBe("2026-07-03");
    expect(addDays("2026-07-31", 1)).toBe("2026-08-01");
    expect(addDays("2026-07-01", -1)).toBe("2026-06-30");
  });

  it("startOfWeek devuelve el lunes de la semana", () => {
    // 2026-07-02 es jueves → lunes 2026-06-29.
    expect(startOfWeek("2026-07-02")).toBe("2026-06-29");
    expect(startOfWeek("2026-06-29")).toBe("2026-06-29");
    expect(startOfWeek("2026-07-05")).toBe("2026-06-29");
  });

  it("weekDays devuelve 7 días consecutivos desde el lunes", () => {
    expect(weekDays("2026-06-29")).toEqual([
      "2026-06-29",
      "2026-06-30",
      "2026-07-01",
      "2026-07-02",
      "2026-07-03",
      "2026-07-04",
      "2026-07-05"
    ]);
  });
});
