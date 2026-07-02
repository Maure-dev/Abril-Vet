import { DEFAULT_DURATION_MIN } from "@app/modules/appointments/constants/constants";
import type {
  AppointmentFormType,
  AppointmentInputType,
  AppointmentType
} from "@app/modules/appointments/entities/entities";

// Convierte la duración del formulario (string) a número; usa un default si está vacía/ inválida.
export function parseDuration(value: string): number {
  const trimmed = value.trim();
  const fallback = Number(DEFAULT_DURATION_MIN);
  if (trimmed.length === 0) {
    return fallback;
  }
  const duration = Number(trimmed);
  return Number.isNaN(duration) || duration <= 0 ? fallback : duration;
}

// Formulario → datos persistibles.
export function toAppointmentInput(form: AppointmentFormType): AppointmentInputType {
  return {
    patientId: form.patientId.trim(),
    clientId: form.clientId.trim(),
    vetId: form.vetId.trim(),
    date: form.date,
    durationMin: parseDuration(form.durationMin),
    type: form.type,
    status: form.status,
    reason: form.reason.trim(),
    notes: form.notes.trim()
  };
}

// Turno existente → formulario (para edición).
export function formFromAppointment(appointment: AppointmentType): AppointmentFormType {
  return {
    patientId: appointment.patientId,
    clientId: appointment.clientId,
    vetId: appointment.vetId,
    date: appointment.date,
    durationMin: String(appointment.durationMin),
    type: appointment.type,
    status: appointment.status,
    reason: appointment.reason,
    notes: appointment.notes
  };
}

// Formatea un ISO datetime-local (yyyy-mm-ddThh:mm) parseando por componentes para evitar
// el desfase de timezone. Devuelve "dd/mm/yyyy hh:mm" o "—" si el valor está vacío/ inválido.
export function formatAppointmentDate(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "—";
  }
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    return trimmed;
  }
  const [, year, month, day, hour, minute] = match;
  return `${day}/${month}/${year} ${hour}:${minute}`;
}
