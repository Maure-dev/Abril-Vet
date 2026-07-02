import { validateSalesForm } from "@app/modules/sales/helpers/validateSalesForm";
import { buildSaleForm, buildSaleItem } from "@app/modules/sales/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateSalesForm", () => {
  it("una venta con un ítem válido y total > 0 no tiene errores", () => {
    const form = buildSaleForm({ items: [buildSaleItem({ quantity: 1, unitPrice: 1000 })] });
    expect(validateSalesForm(form)).toEqual({});
  });

  it("rechaza el carrito vacío", () => {
    const form = buildSaleForm({ items: [] });
    expect(validateSalesForm(form).items).toBeDefined();
  });

  it("rechaza si ninguna línea tiene cantidad mayor a 0", () => {
    const form = buildSaleForm({ items: [buildSaleItem({ quantity: 0, unitPrice: 1000 })] });
    expect(validateSalesForm(form).items).toBeDefined();
  });

  it("rechaza si el descuento deja el total en 0", () => {
    const form = buildSaleForm({
      items: [buildSaleItem({ quantity: 1, unitPrice: 1000 })],
      discount: "1000"
    });
    expect(validateSalesForm(form).discount).toBeDefined();
  });

  it("rechaza una fecha con formato inválido", () => {
    const form = buildSaleForm({
      items: [buildSaleItem({ quantity: 1, unitPrice: 1000 })],
      date: "01/07/2026"
    });
    expect(validateSalesForm(form).date).toBeDefined();
  });
});
