import type { InvoiceItemType } from "@app/modules/billing/entities/entities";
import { computeInvoiceTotals } from "@app/modules/billing/helpers/computeInvoiceTotals";
import { describe, expect, it } from "vitest";

function item(overrides: Partial<InvoiceItemType> = {}): InvoiceItemType {
  return { description: "Consulta", quantity: 1, unitPrice: 1000, ...overrides };
}

describe("computeInvoiceTotals", () => {
  it("suma cantidad * precio unitario de cada ítem en el subtotal", () => {
    const items = [item({ quantity: 2, unitPrice: 1500 }), item({ quantity: 1, unitPrice: 3000 })];
    expect(computeInvoiceTotals(items, 0)).toEqual({ subtotal: 6000, total: 6000 });
  });

  it("resta el descuento del total", () => {
    const items = [item({ quantity: 1, unitPrice: 10000 })];
    expect(computeInvoiceTotals(items, 2500)).toEqual({ subtotal: 10000, total: 7500 });
  });

  it("nunca devuelve un total negativo (piso en 0)", () => {
    const items = [item({ quantity: 1, unitPrice: 1000 })];
    expect(computeInvoiceTotals(items, 5000)).toEqual({ subtotal: 1000, total: 0 });
  });

  it("sin ítems devuelve subtotal y total en 0", () => {
    expect(computeInvoiceTotals([], 0)).toEqual({ subtotal: 0, total: 0 });
  });
});
