import type {
  PurchaseFormErrorsType,
  PurchaseFormType
} from "@app/modules/purchases/entities/entities";

// Función pura: valida el formulario de orden de compra. Devuelve un mapa de errores por campo.
export function validatePurchasesForm(form: PurchaseFormType): PurchaseFormErrorsType {
  const errors: PurchaseFormErrorsType = {};

  if (form.supplierId.trim().length === 0) {
    errors.supplierId = "Asociá la compra a un proveedor";
  }

  // Al menos un ítem con cantidad > 0 (y costo válido).
  const hasValidItem = form.items.some((item) => {
    const quantity = Number(item.quantity);
    const unitCost = Number(item.unitCost);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return false;
    }
    if (Number.isNaN(unitCost) || unitCost < 0) {
      return false;
    }
    return true;
  });
  if (!hasValidItem) {
    errors.items = "Cargá al menos un ítem con cantidad mayor a 0";
  }

  if (form.date.trim().length > 0) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date);
    if (!match) {
      errors.date = "Fecha inválida";
    }
  }

  return errors;
}
