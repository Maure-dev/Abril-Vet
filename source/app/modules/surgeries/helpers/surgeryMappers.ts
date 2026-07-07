import type {
  SurgeryFormType,
  SurgeryInputType,
  SurgeryType
} from "@app/modules/surgeries/entities/entities";

// Formulario → datos persistibles.
export function toSurgeryInput(form: SurgeryFormType): SurgeryInputType {
  return {
    patientId: form.patientId.trim(),
    date: form.date.trim(),
    type: form.type.trim(),
    vetId: form.vetId.trim(),
    assistants: form.assistants.trim(),
    diagnosis: form.diagnosis.trim(),
    medication: form.medication.trim(),
    evolution: form.evolution.trim(),
    status: form.status,
    notes: form.notes.trim(),
    attachments: form.attachments
  };
}

// Cirugía existente → formulario (para edición).
export function formFromSurgery(surgery: SurgeryType): SurgeryFormType {
  return {
    patientId: surgery.patientId,
    date: surgery.date,
    type: surgery.type,
    vetId: surgery.vetId,
    assistants: surgery.assistants,
    diagnosis: surgery.diagnosis,
    medication: surgery.medication,
    evolution: surgery.evolution,
    status: surgery.status,
    notes: surgery.notes,
    // Cirugías antiguas pueden no tener el campo: normalizamos a lista vacía.
    attachments: surgery.attachments ?? []
  };
}
