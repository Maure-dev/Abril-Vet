import { validateHospitalizationForm } from "@app/modules/hospitalizations/helpers/validateHospitalizationForm";
import { buildHospitalizationForm } from "@app/modules/hospitalizations/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateHospitalizationForm", () => {
  it("no devuelve errores con un formulario válido", () => {
    const errors = validateHospitalizationForm(buildHospitalizationForm());
    expect(errors).toEqual({});
  });

  it("exige paciente, fecha de ingreso y motivo", () => {
    const errors = validateHospitalizationForm(
      buildHospitalizationForm({ patientId: "", admissionDate: "", reason: "a" })
    );
    expect(errors.patientId).toBeDefined();
    expect(errors.admissionDate).toBeDefined();
    expect(errors.reason).toBeDefined();
  });

  it("valida fechas inválidas", () => {
    const errors = validateHospitalizationForm(
      buildHospitalizationForm({ admissionDate: "2026-13-40" })
    );
    expect(errors.admissionDate).toBeDefined();
  });

  it("rechaza un alta anterior al ingreso", () => {
    const errors = validateHospitalizationForm(
      buildHospitalizationForm({ admissionDate: "2026-06-20", dischargeDate: "2026-06-10" })
    );
    expect(errors.dischargeDate).toBeDefined();
  });
});
