import type { PurchaseItemType } from "@app/modules/purchases/entities/entities";
import { computePurchaseTotal } from "@app/modules/purchases/helpers/computePurchaseTotal";
import { buildPurchaseItem } from "@app/modules/purchases/tests/factories";
import { describe, expect, it } from "vitest";

describe("computePurchaseTotal", () => {
  it("sin ítems devuelve 0", () => {
    expect(computePurchaseTotal([])).toBe(0);
  });

  it("suma cantidad × costo unitario de cada ítem", () => {
    const items: PurchaseItemType[] = [
      buildPurchaseItem({ quantity: 2, unitCost: 1500 }),
      buildPurchaseItem({ quantity: 3, unitCost: 1000 })
    ];
    expect(computePurchaseTotal(items)).toBe(6000);
  });

  it("ignora cantidades y costos no válidos (negativos o NaN)", () => {
    const items: PurchaseItemType[] = [
      buildPurchaseItem({ quantity: -1, unitCost: 1000 }),
      buildPurchaseItem({ quantity: 2, unitCost: Number.NaN }),
      buildPurchaseItem({ quantity: 4, unitCost: 500 })
    ];
    expect(computePurchaseTotal(items)).toBe(2000);
  });
});
