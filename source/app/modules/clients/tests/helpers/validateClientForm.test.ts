import { validateClientForm } from "@app/modules/clients/helpers/validateClientForm";
import { buildClientForm } from "@app/modules/clients/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateClientForm", () => {
  it("acepta un formulario válido", () => {
    const errors = validateClientForm(buildClientForm());
    expect(errors).toEqual({});
  });

  it("exige nombre y apellido de al menos 2 caracteres", () => {
    const errors = validateClientForm(buildClientForm({ firstName: "A", lastName: "" }));
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
  });

  it("exige teléfono", () => {
    expect(validateClientForm(buildClientForm({ phone: "" })).phone).toBeDefined();
  });

  it("valida el email solo si viene", () => {
    expect(validateClientForm(buildClientForm({ email: "" })).email).toBeUndefined();
    expect(validateClientForm(buildClientForm({ email: "no-es-mail" })).email).toBeDefined();
    expect(validateClientForm(buildClientForm({ email: "ok@example.com" })).email).toBeUndefined();
  });

  it("rechaza saldo no entero", () => {
    expect(validateClientForm(buildClientForm({ balance: "10.5" })).balance).toBeDefined();
    expect(validateClientForm(buildClientForm({ balance: "abc" })).balance).toBeDefined();
    expect(validateClientForm(buildClientForm({ balance: "-500" })).balance).toBeUndefined();
  });
});
