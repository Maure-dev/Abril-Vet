import { EMPTY_FORM } from "@app/modules/dewormings/constants/constants";
import type { DewormingFormType, DewormingType } from "@app/modules/dewormings/entities/entities";

// Factories de datos del módulo desparasitación para tests.

export function buildDeworming(overrides: Partial<DewormingType> = {}): DewormingType {
  return {
    id: "dew-1",
    patientId: "pat-1",
    productName: "Drontal Plus",
    date: "2026-01-10",
    nextDoseDate: "2026-04-10",
    weightKg: "12.5",
    vetId: "vet-1",
    notes: "",
    ...overrides
  };
}

export function buildDewormingForm(overrides: Partial<DewormingFormType> = {}): DewormingFormType {
  return {
    ...EMPTY_FORM,
    patientId: "pat-1",
    productName: "Drontal Plus",
    date: "2026-01-10",
    ...overrides
  };
}
