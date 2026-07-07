import { formatMoney } from "@app/modules/clients/helpers/formatMoney";
import { describe, expect, it } from "vitest";

describe("formatMoney", () => {
  it("formatea un monto en pesos sin decimales", () => {
    const result = formatMoney(1500);
    expect(result).toContain("1.500");
    expect(result).not.toContain(",00");
  });

  it("antepone el signo en montos negativos (deuda)", () => {
    expect(formatMoney(-1500)).toContain("-");
  });

  it("formatea el cero", () => {
    expect(formatMoney(0)).toContain("0");
  });
});
