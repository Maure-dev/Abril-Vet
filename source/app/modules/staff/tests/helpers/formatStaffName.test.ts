import { formatStaffName } from "@app/modules/staff/helpers/formatStaffName";
import { describe, expect, it } from "vitest";

describe("formatStaffName", () => {
  it("arma 'Apellido, Nombre' con ambos campos", () => {
    expect(formatStaffName({ firstName: "Ana", lastName: "Gómez" })).toBe("Gómez, Ana");
  });

  it("tolera espacios sobrantes", () => {
    expect(formatStaffName({ firstName: "  Ana  ", lastName: " Gómez " })).toBe("Gómez, Ana");
  });

  it("devuelve solo el nombre si no hay apellido", () => {
    expect(formatStaffName({ firstName: "Ana", lastName: "" })).toBe("Ana");
  });

  it("devuelve solo el apellido si no hay nombre", () => {
    expect(formatStaffName({ firstName: "", lastName: "Gómez" })).toBe("Gómez");
  });

  it("devuelve cadena vacía si no hay datos", () => {
    expect(formatStaffName({ firstName: " ", lastName: " " })).toBe("");
  });
});
