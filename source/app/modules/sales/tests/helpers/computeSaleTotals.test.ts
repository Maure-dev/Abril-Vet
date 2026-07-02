import { computeSaleTotals } from "@app/modules/sales/helpers/computeSaleTotals";
import { buildSaleItem } from "@app/modules/sales/tests/factories";
import { describe, expect, it } from "vitest";

describe("computeSaleTotals", () => {
  it("carrito vacío devuelve subtotal y total en 0", () => {
    expect(computeSaleTotals([], 0)).toEqual({ subtotal: 0, total: 0 });
  });

  it("suma cantidad × precio de cada línea", () => {
    const items = [
      buildSaleItem({ quantity: 2, unitPrice: 5000 }),
      buildSaleItem({ quantity: 3, unitPrice: 1000 })
    ];
    expect(computeSaleTotals(items, 0)).toEqual({ subtotal: 13000, total: 13000 });
  });

  it("resta el descuento del total sin afectar el subtotal", () => {
    const items = [buildSaleItem({ quantity: 1, unitPrice: 10000 })];
    expect(computeSaleTotals(items, 2500)).toEqual({ subtotal: 10000, total: 7500 });
  });

  it("nunca devuelve un total negativo aunque el descuento exceda el subtotal", () => {
    const items = [buildSaleItem({ quantity: 1, unitPrice: 1000 })];
    expect(computeSaleTotals(items, 5000)).toEqual({ subtotal: 1000, total: 0 });
  });

  it("ignora cantidades, precios y descuentos inválidos (no finitos o negativos)", () => {
    const items = [
      buildSaleItem({ quantity: Number.NaN, unitPrice: 5000 }),
      buildSaleItem({ quantity: 2, unitPrice: -100 }),
      buildSaleItem({ quantity: 4, unitPrice: 250 })
    ];
    expect(computeSaleTotals(items, -50)).toEqual({ subtotal: 1000, total: 1000 });
  });
});
