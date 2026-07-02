import { computeMargin, isLowStock } from "@app/modules/products/helpers/productMetrics";
import { describe, expect, it } from "vitest";

describe("computeMargin", () => {
  it("calcula el margen en porcentaje redondeado", () => {
    expect(computeMargin(1000, 1500)).toBe(50);
    expect(computeMargin(1000, 1000)).toBe(0);
    expect(computeMargin(3, 4)).toBe(33);
  });

  it("devuelve 0 si el costo es menor o igual a 0", () => {
    expect(computeMargin(0, 1500)).toBe(0);
    expect(computeMargin(-100, 1500)).toBe(0);
  });

  it("admite margen negativo si el precio de venta es menor al costo", () => {
    expect(computeMargin(1000, 800)).toBe(-20);
  });
});

describe("isLowStock", () => {
  it("es true cuando el stock está en o por debajo del mínimo", () => {
    expect(isLowStock(5, 5)).toBe(true);
    expect(isLowStock(3, 5)).toBe(true);
    expect(isLowStock(0, 0)).toBe(true);
  });

  it("es false cuando el stock supera el mínimo", () => {
    expect(isLowStock(10, 5)).toBe(false);
  });
});
