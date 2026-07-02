import type { CashMovementType } from "@app/modules/cashRegister/entities/entities";

// Función pura: monto esperado en caja al cierre.
// esperado = apertura + suma(ingresos) - suma(egresos).
export function computeExpectedAmount(
  openingAmount: number,
  movements: CashMovementType[]
): number {
  return movements.reduce((total, movement) => {
    if (movement.type === "income") {
      return total + movement.amount;
    }
    return total - movement.amount;
  }, openingAmount);
}

// Función pura: diferencia de arqueo (positivo = sobrante, negativo = faltante).
// diferencia = contado - esperado.
export function computeCashDifference(expected: number, counted: number): number {
  return counted - expected;
}

// Función pura: formatea un monto en pesos argentinos (ARS) para la UI.
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
