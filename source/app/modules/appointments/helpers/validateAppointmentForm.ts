import type {
  AppointmentFormErrorsType,
  AppointmentFormType
} from "@app/modules/appointments/entities/entities";

// Función pura: valida el formulario de turno. Devuelve un mapa de errores por campo.
export function validateAppointmentForm(form: AppointmentFormType): AppointmentFormErrorsType {
  const errors: AppointmentFormErrorsType = {};

  if (form.patientId.trim().length === 0) {
    errors.patientId = "Asociá el turno a un paciente";
  }

  if (form.date.trim().length === 0) {
    errors.date = "Ingresá la fecha y hora del turno";
  } else {
    const date = new Date(form.date);
    if (Number.isNaN(date.getTime())) {
      errors.date = "Fecha y hora inválidas";
    }
  }

  if (form.durationMin.trim().length > 0) {
    const duration = Number(form.durationMin);
    if (Number.isNaN(duration) || duration <= 0) {
      errors.durationMin = "La duración debe ser un número mayor a 0";
    }
  }

  return errors;
}
