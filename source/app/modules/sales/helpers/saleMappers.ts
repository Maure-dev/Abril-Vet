import type {
  SaleFormType,
  SaleInputType,
  SaleItemDraftType,
  SaleItemType,
  SaleType
} from "@app/modules/sales/entities/entities";
import { computeSaleTotals } from "@app/modules/sales/helpers/computeSaleTotals";

// Convierte una cantidad del formulario (string) a número entero, o 0 si es inválida.
export function parseQuantity(value: string): number {
  const trimmed = value.trim();
  const quantity = Number(trimmed);
  if (trimmed.length === 0 || Number.isNaN(quantity) || quantity <= 0) {
    return 0;
  }
  return Math.floor(quantity);
}

// Convierte un precio del formulario (string) a número ARS entero, o 0 si es inválido.
export function parsePrice(value: string): number {
  const trimmed = value.trim();
  const price = Number(trimmed);
  if (trimmed.length === 0 || Number.isNaN(price) || price < 0) {
    return 0;
  }
  return Math.round(price);
}

// Convierte el descuento del formulario (string) a número ARS entero, o 0 si es inválido.
export function parseDiscount(value: string): number {
  const trimmed = value.trim();
  const discount = Number(trimmed);
  if (trimmed.length === 0 || Number.isNaN(discount) || discount < 0) {
    return 0;
  }
  return Math.round(discount);
}

// Fecha de hoy en formato ISO (yyyy-mm-dd), armada por componentes de la fecha local
// para evitar el desfase de zona horaria de `toISOString()` (que devuelve UTC).
export function todayIso(now: Date = new Date()): string {
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Borrador de línea (formulario) → línea del carrito.
export function draftToItem(draft: SaleItemDraftType): SaleItemType {
  return {
    kind: draft.kind,
    refId: draft.refId.trim(),
    name: draft.name.trim(),
    quantity: parseQuantity(draft.quantity),
    unitPrice: parsePrice(draft.unitPrice)
  };
}

// Formulario → datos persistibles. Recalcula subtotal/total con el helper puro.
export function toSaleInput(form: SaleFormType): SaleInputType {
  const discount = parseDiscount(form.discount);
  const { subtotal, total } = computeSaleTotals(form.items, discount);
  return {
    clientId: form.clientId.trim().length > 0 ? form.clientId.trim() : null,
    date: form.date.trim().length > 0 ? form.date : todayIso(),
    items: form.items,
    discount: discount,
    subtotal: subtotal,
    total: total,
    paymentMethod: form.paymentMethod
  };
}

// Venta existente → formulario (para edición).
export function formFromSale(sale: SaleType): SaleFormType {
  return {
    clientId: sale.clientId ?? "",
    date: sale.date,
    paymentMethod: sale.paymentMethod,
    discount: sale.discount === 0 ? "" : String(sale.discount),
    items: sale.items,
    draft: {
      kind: "product",
      refId: "",
      name: "",
      quantity: "1",
      unitPrice: ""
    }
  };
}
