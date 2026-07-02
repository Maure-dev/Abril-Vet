import type { SaleFormErrorsType, SaleFormType } from "@app/modules/sales/entities/entities";
import { computeSaleTotals } from "@app/modules/sales/helpers/computeSaleTotals";
import { parseDiscount } from "@app/modules/sales/helpers/saleMappers";

// Función pura: valida el formulario de venta. Devuelve un mapa de errores por campo.
// Regla del POS: al menos 1 ítem con cantidad > 0 y total > 0.
export function validateSalesForm(form: SaleFormType): SaleFormErrorsType {
  const errors: SaleFormErrorsType = {};

  const validItems = form.items.filter((item) => item.quantity > 0);
  if (validItems.length === 0) {
    errors.items = "Agregá al menos un ítem con cantidad mayor a 0";
    return errors;
  }

  const { total } = computeSaleTotals(form.items, parseDiscount(form.discount));
  if (total <= 0) {
    errors.discount = "El total de la venta debe ser mayor a 0";
  }

  if (form.date.trim().length > 0) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date);
    if (!match) {
      errors.date = "Fecha inválida";
    }
  }

  return errors;
}
