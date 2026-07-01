import { EMPTY_FORM } from "@app/modules/patients/constants/constants";
import type { PatientFormType, PatientType } from "@app/modules/patients/entities/entities";

// Factories de datos del módulo pacientes para tests.

export function buildPatient(overrides: Partial<PatientType> = {}): PatientType {
  return {
    id: "pat-1",
    clientId: "cli-1",
    name: "Firulais",
    species: "dog",
    breed: "Caniche",
    sex: "male",
    birthDate: "2022-01-15",
    color: "Blanco",
    weightKg: 8.5,
    microchip: "982000123456789",
    identificationNumber: "AV-0001",
    reproductiveStatus: "neutered",
    allergies: "",
    preexistingConditions: "",
    habitualMedication: "",
    notes: "",
    photoUrl: null,
    isActive: true,
    ...overrides
  };
}

export function buildPatientForm(overrides: Partial<PatientFormType> = {}): PatientFormType {
  return {
    ...EMPTY_FORM,
    name: "Firulais",
    clientId: "cli-1",
    ...overrides
  };
}
