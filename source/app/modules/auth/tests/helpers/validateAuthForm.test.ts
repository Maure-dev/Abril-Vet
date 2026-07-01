import {
  isValidEmail,
  validateLoginForm,
  validateRecoverForm
} from "@app/modules/auth/helpers/validateAuthForm";
import { describe, expect, it } from "vitest";

describe("validateAuthForm", () => {
  it("valida el formato de email", () => {
    expect(isValidEmail("vet@abril.com")).toBe(true);
    expect(isValidEmail("no-es-email")).toBe(false);
  });

  it("login: exige email válido y contraseña de 6+", () => {
    expect(validateLoginForm({ email: "vet@abril.com", password: "secreto" })).toEqual({});
    const errors = validateLoginForm({ email: "x", password: "123" });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it("recover: sólo valida el email", () => {
    expect(validateRecoverForm({ email: "vet@abril.com", password: "" })).toEqual({});
    expect(validateRecoverForm({ email: "x", password: "" }).email).toBeDefined();
  });
});
