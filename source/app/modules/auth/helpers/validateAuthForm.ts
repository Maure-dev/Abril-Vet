import type { AuthFormErrorsType, AuthFormType } from "@app/modules/auth/entities/entities";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

// Valida el formulario de ingreso (email + contraseña).
export function validateLoginForm(form: AuthFormType): AuthFormErrorsType {
  const errors: AuthFormErrorsType = {};
  if (!isValidEmail(form.email)) {
    errors.email = "Email inválido";
  }
  if (form.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }
  return errors;
}

// Valida sólo el email (recuperación de contraseña).
export function validateRecoverForm(form: AuthFormType): AuthFormErrorsType {
  const errors: AuthFormErrorsType = {};
  if (!isValidEmail(form.email)) {
    errors.email = "Email inválido";
  }
  return errors;
}
