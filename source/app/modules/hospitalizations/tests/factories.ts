import { EMPTY_FORM } from "@app/modules/hospitalizations/constants/constants";
import type {
  HospitalizationFormType,
  HospitalizationType
} from "@app/modules/hospitalizations/entities/entities";

// Factories de datos del módulo internaciones para tests.

export function buildHospitalization(
  overrides: Partial<HospitalizationType> = {}
): HospitalizationType {
  return {
    id: "hos-1",
    patientId: "pat-1",
    admissionDate: "2026-06-20",
    dischargeDate: "",
    status: "active",
    reason: "Postoperatorio",
    dailyNotes: "",
    medication: "",
    feeding: "",
    controls: "",
    notes: "",
    ...overrides
  };
}

export function buildHospitalizationForm(
  overrides: Partial<HospitalizationFormType> = {}
): HospitalizationFormType {
  return {
    ...EMPTY_FORM,
    patientId: "pat-1",
    admissionDate: "2026-06-20",
    reason: "Postoperatorio",
    ...overrides
  };
}
