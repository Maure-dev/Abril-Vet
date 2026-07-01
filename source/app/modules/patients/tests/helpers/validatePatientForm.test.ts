import { validatePatientForm } from "@app/modules/patients/helpers/validatePatientForm";
import { buildPatientForm } from "@app/modules/patients/tests/factories";
import { describe, expect, it } from "vitest";

describe("validatePatientForm", () => {
  it("acepta un formulario válido", () => {
    const errors = validatePatientForm(buildPatientForm());
    expect(errors).toEqual({});
  });

  it("exige nombre y cliente", () => {
    const errors = validatePatientForm(buildPatientForm({ name: "", clientId: "" }));
    expect(errors.name).toBeDefined();
    expect(errors.clientId).toBeDefined();
  });

  it("rechaza peso no numérico o <= 0", () => {
    expect(validatePatientForm(buildPatientForm({ weightKg: "abc" })).weightKg).toBeDefined();
    expect(validatePatientForm(buildPatientForm({ weightKg: "0" })).weightKg).toBeDefined();
    expect(validatePatientForm(buildPatientForm({ weightKg: "8.5" })).weightKg).toBeUndefined();
  });

  it("rechaza fecha de nacimiento futura", () => {
    expect(
      validatePatientForm(buildPatientForm({ birthDate: "2999-01-01" })).birthDate
    ).toBeDefined();
  });
});
