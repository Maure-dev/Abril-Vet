import { validatePurchasesForm } from "@app/modules/purchases/helpers/validatePurchasesForm";
import { buildPurchaseForm } from "@app/modules/purchases/tests/factories";
import { describe, expect, it } from "vitest";

describe("validatePurchasesForm", () => {
  it("un formulario válido no tiene errores", () => {
    expect(validatePurchasesForm(buildPurchaseForm())).toEqual({});
  });

  it("exige proveedor", () => {
    const errors = validatePurchasesForm(buildPurchaseForm({ supplierId: "  " }));
    expect(errors.supplierId).toBeTruthy();
  });

  it("exige al menos un ítem con cantidad mayor a 0", () => {
    const errors = validatePurchasesForm(
      buildPurchaseForm({ items: [{ productId: "prod-1", quantity: "0", unitCost: "100" }] })
    );
    expect(errors.items).toBeTruthy();
  });

  it("rechaza una fecha con formato inválido", () => {
    const errors = validatePurchasesForm(buildPurchaseForm({ date: "01/06/2026" }));
    expect(errors.date).toBeTruthy();
  });
});
