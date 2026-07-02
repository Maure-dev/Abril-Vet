import type {
  BillingFormErrorsType,
  BillingFormType
} from "@app/modules/billing/entities/entities";

// Función pura: valida el formulario de factura. Devuelve un mapa de errores por campo.
export function validateBillingForm(form: BillingFormType): BillingFormErrorsType {
  const errors: BillingFormErrorsType = {};

  if (form.clientId.trim().length === 0) {
    errors.clientId = "Asociá la factura a un cliente";
  }

  if (form.date.trim().length > 0) {
    const date = new Date(form.date);
    if (Number.isNaN(date.getTime())) {
      errors.date = "Fecha inválida";
    }
  }

  // Al menos un ítem con descripción y cantidad > 0.
  const hasValidItem = form.items.some((item) => {
    const quantity = Number(item.quantity);
    return item.description.trim().length > 0 && !Number.isNaN(quantity) && quantity > 0;
  });
  if (!hasValidItem) {
    errors.items = "Cargá al menos un ítem con descripción y cantidad mayor a 0";
  }

  if (form.discount.trim().length > 0) {
    const discount = Number(form.discount);
    if (Number.isNaN(discount) || discount < 0) {
      errors.discount = "El descuento debe ser un número mayor o igual a 0";
    }
  }

  if (form.paidAmount.trim().length > 0) {
    const paid = Number(form.paidAmount);
    if (Number.isNaN(paid) || paid < 0) {
      errors.paidAmount = "El monto pagado debe ser un número mayor o igual a 0";
    }
  }

  return errors;
}
