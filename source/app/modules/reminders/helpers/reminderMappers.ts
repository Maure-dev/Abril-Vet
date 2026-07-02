import type {
  ReminderFormType,
  ReminderInputType,
  ReminderType
} from "@app/modules/reminders/entities/entities";

// Formulario → datos persistibles.
export function toReminderInput(form: ReminderFormType): ReminderInputType {
  return {
    patientId: form.patientId.trim(),
    clientId: form.clientId.trim(),
    type: form.type,
    channel: form.channel,
    dueDate: form.dueDate.trim(),
    message: form.message.trim(),
    status: form.status
  };
}

// Recordatorio existente → formulario (para edición).
export function formFromReminder(reminder: ReminderType): ReminderFormType {
  return {
    patientId: reminder.patientId,
    clientId: reminder.clientId,
    type: reminder.type,
    channel: reminder.channel,
    dueDate: reminder.dueDate,
    message: reminder.message,
    status: reminder.status
  };
}
