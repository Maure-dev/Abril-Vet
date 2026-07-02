import { EMPTY_FORM } from "@app/modules/billing/constants/constants";
import type { BillingFormType } from "@app/modules/billing/entities/entities";
import { validateBillingForm } from "@app/modules/billing/helpers/validateBillingForm";
import { describe, expect, it } from "vitest";

function buildForm(overrides: Partial<BillingFormType> = {}): BillingFormType {
  return {
    ...EMPTY_FORM,
    clientId: "cli-1",
    items: [{ description: "Consulta", quantity: "1", unitPrice: "5000" }],
    ...overrides
  };
}

describe("validateBillingForm", () => {
  it("un formulario válido no arroja errores", () => {
    expect(validateBillingForm(buildForm())).toEqual({});
  });

  it("exige clientId", () => {
    const errors = validateBillingForm(buildForm({ clientId: "  " }));
    expect(errors.clientId).toBeDefined();
  });

  it("exige al menos un ítem con descripción y cantidad > 0", () => {
    const errors = validateBillingForm(
      buildForm({ items: [{ description: "", quantity: "0", unitPrice: "0" }] })
    );
    expect(errors.items).toBeDefined();
  });

  it("rechaza un descuento negativo", () => {
    const errors = validateBillingForm(buildForm({ discount: "-100" }));
    expect(errors.discount).toBeDefined();
  });
});
