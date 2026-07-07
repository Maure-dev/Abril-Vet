import { EMPTY_FORM } from "@app/modules/medicalRecords/constants/constants";
import type {
  MedicalRecordFormType,
  MedicalRecordType
} from "@app/modules/medicalRecords/entities/entities";

// Factories de datos del módulo historia clínica para tests.

export function buildMedicalRecord(overrides: Partial<MedicalRecordType> = {}): MedicalRecordType {
  return {
    id: "rec-1",
    patientId: "pat-1",
    vetId: "vet-1",
    date: "2026-06-01",
    reason: "Control anual",
    anamnesis: "Sin síntomas reportados",
    physicalExam: "Normal",
    diagnosis: "Sano",
    treatment: "",
    prescription: "",
    indications: "Volver en un año",
    evolution: "",
    nextControlDate: "2027-06-01",
    attachments: [],
    ...overrides
  };
}

export function buildMedicalRecordForm(
  overrides: Partial<MedicalRecordFormType> = {}
): MedicalRecordFormType {
  return {
    ...EMPTY_FORM,
    patientId: "pat-1",
    date: "2026-06-01",
    reason: "Control anual",
    ...overrides
  };
}
