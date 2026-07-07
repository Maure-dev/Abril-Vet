import { EMPTY_FORM } from "@app/modules/surgeries/constants/constants";
import type { SurgeryFormType, SurgeryType } from "@app/modules/surgeries/entities/entities";

// Factories de datos del módulo cirugías para tests.

export function buildSurgery(overrides: Partial<SurgeryType> = {}): SurgeryType {
  return {
    id: "sur-1",
    patientId: "pat-1",
    date: "2026-05-10",
    type: "Castración",
    vetId: "vet-1",
    assistants: "Ana",
    diagnosis: "",
    medication: "",
    evolution: "",
    status: "scheduled",
    notes: "",
    attachments: [],
    ...overrides
  };
}

export function buildSurgeryForm(overrides: Partial<SurgeryFormType> = {}): SurgeryFormType {
  return {
    ...EMPTY_FORM,
    patientId: "pat-1",
    type: "Castración",
    ...overrides
  };
}
