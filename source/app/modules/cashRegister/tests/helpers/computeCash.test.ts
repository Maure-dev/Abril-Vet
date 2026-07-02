import {
  computeCashDifference,
  computeExpectedAmount,
  formatMoney
} from "@app/modules/cashRegister/helpers/computeCash";
import { buildCashMovement } from "@app/modules/cashRegister/tests/factories";
import { describe, expect, it } from "vitest";

describe("computeExpectedAmount", () => {
  it("sin movimientos devuelve el monto de apertura", () => {
    expect(computeExpectedAmount(5000, [])).toBe(5000);
  });

  it("suma ingresos y resta egresos sobre la apertura", () => {
    const movements = [
      buildCashMovement({ type: "income", amount: 1500 }),
      buildCashMovement({ type: "income", amount: 500 }),
      buildCashMovement({ type: "expense", amount: 800 })
    ];
    expect(computeExpectedAmount(5000, movements)).toBe(6200);
  });

  it("puede quedar por debajo de la apertura con egresos", () => {
    const movements = [buildCashMovement({ type: "expense", amount: 2000 })];
    expect(computeExpectedAmount(1000, movements)).toBe(-1000);
  });
});

describe("computeCashDifference", () => {
  it("devuelve 0 cuando el contado coincide con el esperado", () => {
    expect(computeCashDifference(6200, 6200)).toBe(0);
  });

  it("positivo cuando hay sobrante (contado > esperado)", () => {
    expect(computeCashDifference(6200, 6500)).toBe(300);
  });

  it("negativo cuando hay faltante (contado < esperado)", () => {
    expect(computeCashDifference(6200, 6000)).toBe(-200);
  });
});

describe("formatMoney", () => {
  it("formatea el monto como pesos argentinos", () => {
    const result = formatMoney(6200);
    expect(result).toContain("6.200");
    expect(result).toContain("$");
  });
});
