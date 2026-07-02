import type {
  PurchaseOrderType,
  PurchaseStatusFilterType
} from "@app/modules/purchases/entities/entities";

// Función pura: filtra órdenes de compra por texto (proveedor, N° de factura)
// y por estado. Case-insensitive.
export function filterPurchases(
  items: PurchaseOrderType[],
  query: string,
  statusFilter: PurchaseStatusFilterType
): PurchaseOrderType[] {
  const q = query.trim().toLowerCase();
  return items.filter((purchase) => {
    if (statusFilter !== "all" && purchase.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [purchase.supplierId, purchase.invoiceNumber].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
