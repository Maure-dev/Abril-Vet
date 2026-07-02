import { validateStaffForm } from "@app/modules/staff/helpers/validateStaffForm";
import { buildStaffForm } from "@app/modules/staff/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateStaffForm", () => {
  it("un formulario válido no tiene errores", () => {
    expect(validateStaffForm(buildStaffForm())).toEqual({});
  });

  it("exige nombre de al menos 2 caracteres", () => {
    const errors = validateStaffForm(buildStaffForm({ firstName: "A" }));
    expect(errors.firstName).toBeDefined();
  });

  it("exige apellido de al menos 2 caracteres", () => {
    const errors = validateStaffForm(buildStaffForm({ lastName: " " }));
    expect(errors.lastName).toBeDefined();
  });

  it("rechaza emails inválidos y acepta válidos", () => {
    expect(validateStaffForm(buildStaffForm({ email: "no-es-email" })).email).toBeDefined();
    expect(validateStaffForm(buildStaffForm({ email: "sin@dominio" })).email).toBeDefined();
    expect(validateStaffForm(buildStaffForm({ email: "ok@abrilvet.com" })).email).toBeUndefined();
  });

  it("al crear (requirePassword) exige contraseña de al menos 6 caracteres", () => {
    expect(validateStaffForm(buildStaffForm({ password: "123" }), true).password).toBeDefined();
    expect(
      validateStaffForm(buildStaffForm({ password: "secreto1" }), true).password
    ).toBeUndefined();
    // Sin requirePassword no valida la contraseña (edición).
    expect(validateStaffForm(buildStaffForm({ password: "" })).password).toBeUndefined();
  });
});
