import type { SaleType } from "@app/modules/sales/entities/entities";

// Función pura: filtra ventas por el ID de cliente asociado. Case-insensitive.
// Las ventas al público (clientId null) sólo aparecen cuando la búsqueda está vacía.
export function filterSales(items: SaleType[], query: string): SaleType[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return items;
  }
  return items.filter((sale) => (sale.clientId ?? "").toLowerCase().includes(q));
}
