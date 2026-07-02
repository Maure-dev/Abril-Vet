import type { SaleItemType } from "@app/modules/sales/entities/entities";

// Función pura: calcula el subtotal (suma de cantidad × precio unitario de cada línea)
// y el total (subtotal menos descuento, nunca negativo). Ignora cantidades/precios no
// finitos o negativos para no propagar valores inválidos al total.
export function computeSaleTotals(
  items: SaleItemType[],
  discount: number
): { subtotal: number; total: number } {
  const subtotal = items.reduce((acc, item) => {
    const quantity = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
    const unitPrice = Number.isFinite(item.unitPrice) && item.unitPrice > 0 ? item.unitPrice : 0;
    return acc + quantity * unitPrice;
  }, 0);

  const safeDiscount = Number.isFinite(discount) && discount > 0 ? discount : 0;
  const total = Math.max(0, subtotal - safeDiscount);

  return { subtotal: subtotal, total: total };
}
