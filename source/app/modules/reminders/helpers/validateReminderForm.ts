import type {
  ReminderFormErrorsType,
  ReminderFormType
} from "@app/modules/reminders/entities/entities";

// Función pura: valida el formulario de recordatorio. Devuelve un mapa de errores por campo.
export function validateReminderForm(form: ReminderFormType): ReminderFormErrorsType {
  const errors: ReminderFormErrorsType = {};

  const dueDate = form.dueDate.trim();
  if (dueDate.length === 0) {
    errors.dueDate = "Ingresá la fecha de vencimiento";
  } else {
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = "Fecha de vencimiento inválida";
    }
  }

  if (form.message.trim().length < 3) {
    errors.message = "El mensaje debe tener al menos 3 caracteres";
  }

  return errors;
}
