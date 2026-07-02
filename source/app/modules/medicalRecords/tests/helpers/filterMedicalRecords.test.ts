import { filterMedicalRecords } from "@app/modules/medicalRecords/helpers/filterMedicalRecords";
import { buildMedicalRecord } from "@app/modules/medicalRecords/tests/factories";
import { describe, expect, it } from "vitest";

const a = buildMedicalRecord({
  id: "1",
  patientId: "pat-1",
  reason: "Vómitos",
  diagnosis: "Gastritis"
});
const b = buildMedicalRecord({
  id: "2",
  patientId: "pat-2",
  reason: "Control",
  diagnosis: "Sano"
});

describe("filterMedicalRecords", () => {
  it("sin query ni filtro devuelve todos", () => {
    expect(filterMedicalRecords([a, b], "", "")).toHaveLength(2);
  });

  it("filtra por paciente (patientId exacto, case-insensitive)", () => {
    expect(filterMedicalRecords([a, b], "", "PAT-2")).toEqual([b]);
  });

  it("busca por motivo o diagnóstico (case-insensitive)", () => {
    expect(filterMedicalRecords([a, b], "gastritis", "")).toEqual([a]);
    expect(filterMedicalRecords([a, b], "control", "")).toEqual([b]);
  });
});
