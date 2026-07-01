import type {
  PatientFormType,
  PatientInputType,
  PatientType
} from "@app/modules/patients/entities/entities";

// Convierte el peso del formulario (string) a número, o null si está vacío/ inválido.
export function parseWeight(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const weight = Number(trimmed);
  return Number.isNaN(weight) || weight <= 0 ? null : weight;
}

// Formulario → datos persistibles. `base` aporta los campos que no están en el form
// (photoUrl, isActive), tomados del paciente existente en edición.
export function toPatientInput(
  form: PatientFormType,
  base: { photoUrl?: string | null; isActive?: boolean } = {}
): PatientInputType {
  return {
    clientId: form.clientId.trim(),
    name: form.name.trim(),
    species: form.species,
    breed: form.breed.trim(),
    sex: form.sex,
    birthDate: form.birthDate.trim().length > 0 ? form.birthDate : null,
    color: form.color.trim(),
    weightKg: parseWeight(form.weightKg),
    microchip: form.microchip.trim(),
    identificationNumber: form.identificationNumber.trim(),
    reproductiveStatus: form.reproductiveStatus,
    allergies: form.allergies.trim(),
    preexistingConditions: form.preexistingConditions.trim(),
    habitualMedication: form.habitualMedication.trim(),
    notes: form.notes.trim(),
    photoUrl: base.photoUrl ?? null,
    isActive: base.isActive ?? true
  };
}

// Paciente existente → formulario (para edición).
export function formFromPatient(patient: PatientType): PatientFormType {
  return {
    clientId: patient.clientId,
    name: patient.name,
    species: patient.species,
    breed: patient.breed,
    sex: patient.sex,
    birthDate: patient.birthDate ?? "",
    color: patient.color,
    weightKg: patient.weightKg === null ? "" : String(patient.weightKg),
    microchip: patient.microchip,
    identificationNumber: patient.identificationNumber,
    reproductiveStatus: patient.reproductiveStatus,
    allergies: patient.allergies,
    preexistingConditions: patient.preexistingConditions,
    habitualMedication: patient.habitualMedication,
    notes: patient.notes
  };
}
