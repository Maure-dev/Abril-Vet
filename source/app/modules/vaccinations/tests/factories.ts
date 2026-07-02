import { EMPTY_FORM } from "@app/modules/vaccinations/constants/constants";
import type {
  VaccinationFormType,
  VaccinationType
} from "@app/modules/vaccinations/entities/entities";

// Factories de datos del módulo vacunación para tests.

export function buildVaccination(overrides: Partial<VaccinationType> = {}): VaccinationType {
  return {
    id: "vac-1",
    patientId: "pat-1",
    vaccineName: "Antirrábica",
    date: "2026-01-10",
    nextDoseDate: "2027-01-10",
    batch: "LOTE-123",
    vetId: "vet-1",
    notes: "",
    ...overrides
  };
}

export function buildVaccinationForm(
  overrides: Partial<VaccinationFormType> = {}
): VaccinationFormType {
  return {
    ...EMPTY_FORM,
    patientId: "pat-1",
    vaccineName: "Antirrábica",
    date: "2026-01-10",
    ...overrides
  };
}
