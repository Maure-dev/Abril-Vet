import type { ClientInvoiceType, InvoiceSummaryType } from "@app/modules/clients/entities/entities";

// Función pura: totaliza lo facturado (total) y lo pagado (paidAmount) de una lista de facturas.
export function summarizeInvoices(invoices: ClientInvoiceType[]): InvoiceSummaryType {
  return invoices.reduce<InvoiceSummaryType>(
    (acc, invoice) => ({
      billed: acc.billed + invoice.total,
      paid: acc.paid + invoice.paidAmount
    }),
    { billed: 0, paid: 0 }
  );
}
