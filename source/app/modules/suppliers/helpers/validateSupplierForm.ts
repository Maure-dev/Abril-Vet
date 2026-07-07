import type {
  SupplierFormErrorsType,
  SupplierFormType
} from "@app/modules/suppliers/entities/entities";

// Patrón simple para validar el email (sólo si viene cargado).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Función pura: valida el formulario de proveedor. Devuelve un mapa de errores por campo.
export function validateSupplierForm(form: SupplierFormType): SupplierFormErrorsType {
  const errors: SupplierFormErrorsType = {};

  if (form.name.trim().length < 2) {
    errors.name = "Ingresá el nombre del proveedor";
  }

  const email = form.email.trim();
  if (email.length > 0 && !EMAIL_REGEX.test(email)) {
    errors.email = "Ingresá un email válido";
  }

  return errors;
}
