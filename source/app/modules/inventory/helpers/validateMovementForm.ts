import type {
  MovementFormErrorsType,
  MovementFormType
} from "@app/modules/inventory/entities/entities";

// Función pura: valida el formulario de movimiento. Devuelve un mapa de errores por campo.
export function validateMovementForm(form: MovementFormType): MovementFormErrorsType {
  const errors: MovementFormErrorsType = {};

  if (form.productId.trim().length === 0) {
    errors.productId = "Asociá el movimiento a un producto";
  }

  const trimmedQuantity = form.quantity.trim();
  if (trimmedQuantity.length === 0) {
    errors.quantity = "Ingresá la cantidad";
  } else {
    const quantity = Number(trimmedQuantity);
    if (Number.isNaN(quantity)) {
      errors.quantity = "La cantidad debe ser un número";
    } else if (quantity === 0) {
      errors.quantity = "La cantidad debe ser distinta de 0";
    }
  }

  if (form.date.trim().length > 0) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date.trim());
    if (!match) {
      errors.date = "Fecha inválida";
    }
  }

  return errors;
}
