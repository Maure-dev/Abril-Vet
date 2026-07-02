import { validateSurgeriesForm } from "@app/modules/surgeries/helpers/validateSurgeriesForm";
import { buildSurgeryForm } from "@app/modules/surgeries/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateSurgeriesForm", () => {
  it("acepta un formulario válido", () => {
    const errors = validateSurgeriesForm(buildSurgeryForm());
    expect(errors).toEqual({});
  });

  it("exige paciente y tipo (>= 2 caracteres)", () => {
    const errors = validateSurgeriesForm(buildSurgeryForm({ patientId: "", type: "a" }));
    expect(errors.patientId).toBeDefined();
    expect(errors.type).toBeDefined();
  });

  it("acepta fecha vacía y rechaza fecha inválida", () => {
    expect(validateSurgeriesForm(buildSurgeryForm({ date: "" })).date).toBeUndefined();
    expect(validateSurgeriesForm(buildSurgeryForm({ date: "2026-13-40" })).date).toBeDefined();
    expect(validateSurgeriesForm(buildSurgeryForm({ date: "no-fecha" })).date).toBeDefined();
    expect(validateSurgeriesForm(buildSurgeryForm({ date: "2026-05-10" })).date).toBeUndefined();
  });
});
