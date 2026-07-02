import type { InvoiceItemType } from "@app/modules/billing/entities/entities";

// Función pura: calcula el subtotal y el total de una factura.
// subtotal = suma de (cantidad * precio unitario) de cada ítem.
// total = max(0, subtotal - descuento) — nunca negativo.
export function computeInvoiceTotals(
  items: InvoiceItemType[],
  discount: number
): { subtotal: number; total: number } {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const total = Math.max(0, subtotal - discount);
  return { subtotal: subtotal, total: total };
}
