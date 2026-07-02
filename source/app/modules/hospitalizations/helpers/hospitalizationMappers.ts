import type {
  HospitalizationFormType,
  HospitalizationInputType,
  HospitalizationType
} from "@app/modules/hospitalizations/entities/entities";

// Formulario → datos persistibles. Si el estado es "discharged" pero no hay fecha de alta,
// no forzamos nada extra: se persiste tal cual lo cargó el usuario.
export function toHospitalizationInput(form: HospitalizationFormType): HospitalizationInputType {
  return {
    patientId: form.patientId.trim(),
    admissionDate: form.admissionDate.trim(),
    dischargeDate: form.dischargeDate.trim(),
    status: form.status,
    reason: form.reason.trim(),
    dailyNotes: form.dailyNotes.trim(),
    medication: form.medication.trim(),
    feeding: form.feeding.trim(),
    controls: form.controls.trim(),
    notes: form.notes.trim()
  };
}

// Internación existente → formulario (para edición).
export function formFromHospitalization(
  hospitalization: HospitalizationType
): HospitalizationFormType {
  return {
    patientId: hospitalization.patientId,
    admissionDate: hospitalization.admissionDate,
    dischargeDate: hospitalization.dischargeDate,
    status: hospitalization.status,
    reason: hospitalization.reason,
    dailyNotes: hospitalization.dailyNotes,
    medication: hospitalization.medication,
    feeding: hospitalization.feeding,
    controls: hospitalization.controls,
    notes: hospitalization.notes
  };
}
