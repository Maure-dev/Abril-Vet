import type {
  BillingFormType,
  InvoiceInputType,
  InvoiceItemFormType,
  InvoiceItemType,
  InvoiceType
} from "@app/modules/billing/entities/entities";
import { computeInvoiceTotals } from "@app/modules/billing/helpers/computeInvoiceTotals";

// Convierte un número entero de un input (string) a entero >= 0, o 0 si es inválido/vacío.
export function parseAmount(value: string): number {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  const amount = Number(trimmed);
  return Number.isNaN(amount) || amount < 0 ? 0 : Math.trunc(amount);
}

// Filas del formulario → ítems persistibles. Descarta filas sin descripción o con cantidad <= 0.
export function toInvoiceItems(rows: InvoiceItemFormType[]): InvoiceItemType[] {
  return rows
    .map((row) => ({
      description: row.description.trim(),
      quantity: parseAmount(row.quantity),
      unitPrice: parseAmount(row.unitPrice)
    }))
    .filter((item) => item.description.length > 0 && item.quantity > 0);
}

// Formulario → datos persistibles. Recalcula subtotal y total desde los ítems y el descuento.
export function toInvoiceInput(form: BillingFormType): InvoiceInputType {
  const items = toInvoiceItems(form.items);
  const discount = parseAmount(form.discount);
  const { subtotal, total } = computeInvoiceTotals(items, discount);
  return {
    clientId: form.clientId.trim(),
    date: form.date.trim(),
    items: items,
    discount: discount,
    subtotal: subtotal,
    total: total,
    paymentMethod: form.paymentMethod,
    status: form.status,
    paidAmount: parseAmount(form.paidAmount),
    notes: form.notes.trim()
  };
}

// Factura existente → formulario (para edición).
export function formFromInvoice(invoice: InvoiceType): BillingFormType {
  const rows: InvoiceItemFormType[] =
    invoice.items.length > 0
      ? invoice.items.map((item) => ({
          description: item.description,
          quantity: String(item.quantity),
          unitPrice: String(item.unitPrice)
        }))
      : [{ description: "", quantity: "1", unitPrice: "0" }];
  return {
    clientId: invoice.clientId,
    date: invoice.date,
    items: rows,
    discount: String(invoice.discount),
    paymentMethod: invoice.paymentMethod,
    status: invoice.status,
    paidAmount: String(invoice.paidAmount),
    notes: invoice.notes
  };
}
