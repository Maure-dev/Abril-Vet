import type { ClientFormErrorsType, ClientFormType } from "@app/modules/clients/entities/entities";

// Formato de email simple (suficiente para validación de UI).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Función pura: valida el formulario de cliente. Devuelve un mapa de errores por campo.
export function validateClientForm(form: ClientFormType): ClientFormErrorsType {
  const errors: ClientFormErrorsType = {};

  if (form.firstName.trim().length < 2) {
    errors.firstName = "Ingresá el nombre (mínimo 2 caracteres)";
  }
  if (form.lastName.trim().length < 2) {
    errors.lastName = "Ingresá el apellido (mínimo 2 caracteres)";
  }
  if (form.phone.trim().length === 0) {
    errors.phone = "Ingresá un teléfono de contacto";
  }

  const email = form.email.trim();
  if (email.length > 0 && !EMAIL_PATTERN.test(email)) {
    errors.email = "El email no tiene un formato válido";
  }

  if (form.balance.trim().length > 0) {
    const balance = Number(form.balance);
    if (Number.isNaN(balance) || !Number.isInteger(balance)) {
      errors.balance = "El saldo debe ser un número entero (ARS)";
    }
  }

  return errors;
}
