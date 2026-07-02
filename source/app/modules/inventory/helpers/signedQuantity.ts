import type { StockMovementType } from "@app/modules/inventory/entities/entities";

// Función pura: devuelve la cantidad con signo según el tipo de movimiento.
// Entrada y ajuste suman (positivo); salida y transferencia restan (negativo).
// Usa Math.abs sobre la magnitud y aplica el signo por tipo, así el signo no depende
// de cómo se haya cargado la cantidad.
export function signedQuantity(movement: StockMovementType): number {
  const magnitude = Math.abs(movement.quantity);
  if (movement.type === "in" || movement.type === "adjustment") {
    return magnitude;
  }
  return -magnitude;
}
