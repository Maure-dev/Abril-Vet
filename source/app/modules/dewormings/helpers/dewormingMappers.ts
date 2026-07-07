import type {
  DewormingFormType,
  DewormingInputType,
  DewormingType
} from "@app/modules/dewormings/entities/entities";

// Formulario → datos persistibles.
export function toDewormingInput(form: DewormingFormType): DewormingInputType {
  return {
    patientId: form.patientId.trim(),
    productName: form.productName.trim(),
    date: form.date.trim(),
    nextDoseDate: form.nextDoseDate.trim(),
    weightKg: form.weightKg.trim(),
    vetId: form.vetId.trim(),
    notes: form.notes.trim()
  };
}

// Desparasitación existente → formulario (para edición).
export function formFromDeworming(deworming: DewormingType): DewormingFormType {
  return {
    patientId: deworming.patientId,
    productName: deworming.productName,
    date: deworming.date,
    nextDoseDate: deworming.nextDoseDate,
    weightKg: deworming.weightKg,
    vetId: deworming.vetId,
    notes: deworming.notes
  };
}
