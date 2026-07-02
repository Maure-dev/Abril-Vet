import type {
  MovementFormType,
  StockMovementInputType,
  StockMovementType
} from "@app/modules/inventory/entities/entities";

// Convierte la cantidad del formulario (string) a número, o 0 si está vacío/ inválido.
export function parseQuantity(value: string): number {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  const quantity = Number(trimmed);
  return Number.isNaN(quantity) ? 0 : quantity;
}

// Formulario → datos persistibles.
export function toMovementInput(form: MovementFormType): StockMovementInputType {
  return {
    productId: form.productId.trim(),
    type: form.type,
    quantity: parseQuantity(form.quantity),
    reason: form.reason.trim(),
    date: form.date.trim(),
    warehouse: form.warehouse.trim(),
    notes: form.notes.trim()
  };
}

// Movimiento existente → formulario (para edición).
export function formFromMovement(movement: StockMovementType): MovementFormType {
  return {
    productId: movement.productId,
    type: movement.type,
    quantity: String(movement.quantity),
    reason: movement.reason,
    date: movement.date,
    warehouse: movement.warehouse,
    notes: movement.notes
  };
}
