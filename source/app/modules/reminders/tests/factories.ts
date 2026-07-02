import { EMPTY_FORM } from "@app/modules/reminders/constants/constants";
import type { ReminderFormType, ReminderType } from "@app/modules/reminders/entities/entities";

// Factories de datos del módulo recordatorios para tests.

export function buildReminder(overrides: Partial<ReminderType> = {}): ReminderType {
  return {
    id: "rem-1",
    patientId: "pat-1",
    clientId: "cli-1",
    type: "vaccine",
    channel: "email",
    dueDate: "2026-08-15",
    message: "Recordá la vacuna antirrábica",
    status: "pending",
    ...overrides
  };
}

export function buildReminderForm(overrides: Partial<ReminderFormType> = {}): ReminderFormType {
  return {
    ...EMPTY_FORM,
    dueDate: "2026-08-15",
    message: "Recordá la vacuna antirrábica",
    ...overrides
  };
}
