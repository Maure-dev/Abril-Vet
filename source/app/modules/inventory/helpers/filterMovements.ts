import type {
  MovementTypeFilterType,
  StockMovementType
} from "@app/modules/inventory/entities/entities";

// Función pura: filtra movimientos por texto (producto, motivo) y por tipo.
// Case-insensitive.
export function filterMovements(
  items: StockMovementType[],
  query: string,
  typeFilter: MovementTypeFilterType
): StockMovementType[] {
  const q = query.trim().toLowerCase();
  return items.filter((m) => {
    if (typeFilter !== "all" && m.type !== typeFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [m.productId, m.reason].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
