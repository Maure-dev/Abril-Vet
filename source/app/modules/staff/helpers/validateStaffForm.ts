import { ROLE_LABELS } from "@app/modules/main/constants/constants";
import type { UserRoleType } from "@app/modules/main/entities/entities";
import type { StaffFormErrorsType, StaffFormType } from "@app/modules/staff/entities/entities";

// Regex simple para validar el formato del email (no exhaustiva, evita casos obvios inválidos).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_ROLES = Object.keys(ROLE_LABELS) as UserRoleType[];

// Función pura: valida el formulario de personal. Devuelve un mapa de errores por campo.
// `requirePassword` = true al crear (la contraseña inicial del usuario de Firebase Auth).
export function validateStaffForm(
  form: StaffFormType,
  requirePassword = false
): StaffFormErrorsType {
  const errors: StaffFormErrorsType = {};

  if (form.firstName.trim().length < 2) {
    errors.firstName = "Ingresá el nombre (mínimo 2 caracteres)";
  }
  if (form.lastName.trim().length < 2) {
    errors.lastName = "Ingresá el apellido (mínimo 2 caracteres)";
  }
  if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Ingresá un email válido";
  }
  if (form.roles.length === 0 || !form.roles.every((r) => VALID_ROLES.includes(r))) {
    errors.roles = "Seleccioná al menos un rol";
  }
  if (requirePassword && form.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
}
