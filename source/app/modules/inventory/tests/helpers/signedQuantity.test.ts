import { signedQuantity } from "@app/modules/inventory/helpers/signedQuantity";
import { buildMovement } from "@app/modules/inventory/tests/factories";
import { describe, expect, it } from "vitest";

describe("signedQuantity", () => {
  it("entrada y ajuste son positivos", () => {
    expect(signedQuantity(buildMovement({ type: "in", quantity: 10 }))).toBe(10);
    expect(signedQuantity(buildMovement({ type: "adjustment", quantity: 5 }))).toBe(5);
  });

  it("salida y transferencia son negativos", () => {
    expect(signedQuantity(buildMovement({ type: "out", quantity: 7 }))).toBe(-7);
    expect(signedQuantity(buildMovement({ type: "transfer", quantity: 3 }))).toBe(-3);
  });

  it("aplica el signo por tipo usando la magnitud (ignora el signo cargado)", () => {
    expect(signedQuantity(buildMovement({ type: "in", quantity: -10 }))).toBe(10);
    expect(signedQuantity(buildMovement({ type: "out", quantity: -4 }))).toBe(-4);
    expect(signedQuantity(buildMovement({ type: "transfer", quantity: -2 }))).toBe(-2);
  });
});
