import { formatClientName } from "@app/modules/clients/helpers/formatClientName";
import { describe, expect, it } from "vitest";

describe("formatClientName", () => {
  it("arma 'Apellido, Nombre'", () => {
    expect(formatClientName({ firstName: "Ana", lastName: "García" })).toBe("García, Ana");
  });

  it("devuelve solo el nombre si falta el apellido", () => {
    expect(formatClientName({ firstName: "Ana", lastName: "" })).toBe("Ana");
  });

  it("devuelve solo el apellido si falta el nombre", () => {
    expect(formatClientName({ firstName: "  ", lastName: "García" })).toBe("García");
  });

  it("recorta espacios sobrantes", () => {
    expect(formatClientName({ firstName: " Ana ", lastName: " García " })).toBe("García, Ana");
  });
});
