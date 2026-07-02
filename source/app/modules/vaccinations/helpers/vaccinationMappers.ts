import type {
  VaccinationFormType,
  VaccinationInputType,
  VaccinationType
} from "@app/modules/vaccinations/entities/entities";

// Formulario → datos persistibles.
export function toVaccinationInput(form: VaccinationFormType): VaccinationInputType {
  return {
    patientId: form.patientId.trim(),
    vaccineName: form.vaccineName.trim(),
    date: form.date.trim(),
    nextDoseDate: form.nextDoseDate.trim(),
    batch: form.batch.trim(),
    vetId: form.vetId.trim(),
    notes: form.notes.trim()
  };
}

// Vacunación existente → formulario (para edición).
export function formFromVaccination(vaccination: VaccinationType): VaccinationFormType {
  return {
    patientId: vaccination.patientId,
    vaccineName: vaccination.vaccineName,
    date: vaccination.date,
    nextDoseDate: vaccination.nextDoseDate,
    batch: vaccination.batch,
    vetId: vaccination.vetId,
    notes: vaccination.notes
  };
}
