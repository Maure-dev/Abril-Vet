import { EMPTY_FORM } from "@app/modules/inventory/constants/constants";
import type { MovementFormType, StockMovementType } from "@app/modules/inventory/entities/entities";

// Factories de datos del módulo inventario para tests.

export function buildMovement(overrides: Partial<StockMovementType> = {}): StockMovementType {
  return {
    id: "mov-1",
    productId: "prod-1",
    type: "in",
    quantity: 10,
    reason: "Compra a proveedor",
    date: "2026-06-15",
    warehouse: "Depósito central",
    notes: "",
    ...overrides
  };
}

export function buildMovementForm(overrides: Partial<MovementFormType> = {}): MovementFormType {
  return {
    ...EMPTY_FORM,
    productId: "prod-1",
    quantity: "10",
    ...overrides
  };
}
