import { EMPTY_FORM } from "@app/modules/appointments/constants/constants";
import type {
  AppointmentFormType,
  AppointmentType
} from "@app/modules/appointments/entities/entities";

// Factories de datos del módulo agenda para tests.

export function buildAppointment(overrides: Partial<AppointmentType> = {}): AppointmentType {
  return {
    id: "apt-1",
    patientId: "pat-1",
    clientId: "cli-1",
    vetId: "vet-1",
    date: "2026-07-10T09:30",
    durationMin: 30,
    type: "consultation",
    status: "scheduled",
    reason: "Control anual",
    notes: "",
    ...overrides
  };
}

export function buildAppointmentForm(
  overrides: Partial<AppointmentFormType> = {}
): AppointmentFormType {
  return {
    ...EMPTY_FORM,
    patientId: "pat-1",
    date: "2026-07-10T09:30",
    ...overrides
  };
}
