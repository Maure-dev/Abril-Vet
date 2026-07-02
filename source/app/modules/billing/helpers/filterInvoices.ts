import type { InvoiceStatusFilterType, InvoiceType } from "@app/modules/billing/entities/entities";

// Función pura: filtra facturas por texto (cliente) y por estado. Case-insensitive.
export function filterInvoices(
  items: InvoiceType[],
  query: string,
  statusFilter: InvoiceStatusFilterType
): InvoiceType[] {
  const q = query.trim().toLowerCase();
  return items.filter((invoice) => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return invoice.clientId.toLowerCase().includes(q);
  });
}
