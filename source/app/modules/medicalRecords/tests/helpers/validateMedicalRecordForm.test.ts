import { validateMedicalRecordForm } from "@app/modules/medicalRecords/helpers/validateMedicalRecordForm";
import { buildMedicalRecordForm } from "@app/modules/medicalRecords/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateMedicalRecordForm", () => {
  it("acepta un formulario válido", () => {
    const errors = validateMedicalRecordForm(buildMedicalRecordForm());
    expect(errors).toEqual({});
  });

  it("exige paciente, fecha y motivo", () => {
    const errors = validateMedicalRecordForm(
      buildMedicalRecordForm({ patientId: "", date: "", reason: "" })
    );
    expect(errors.patientId).toBeDefined();
    expect(errors.date).toBeDefined();
    expect(errors.reason).toBeDefined();
  });

  it("rechaza un motivo demasiado corto", () => {
    expect(validateMedicalRecordForm(buildMedicalRecordForm({ reason: "a" })).reason).toBeDefined();
  });

  it("rechaza una fecha de consulta inválida", () => {
    expect(
      validateMedicalRecordForm(buildMedicalRecordForm({ date: "2026-13-40" })).date
    ).toBeDefined();
  });

  it("valida el próximo control sólo si viene cargado", () => {
    expect(
      validateMedicalRecordForm(buildMedicalRecordForm({ nextControlDate: "" })).nextControlDate
    ).toBeUndefined();
    expect(
      validateMedicalRecordForm(buildMedicalRecordForm({ nextControlDate: "no-fecha" }))
        .nextControlDate
    ).toBeDefined();
  });
});
