import type {
  PurchaseFormType,
  PurchaseInputType,
  PurchaseItemFormType,
  PurchaseItemType,
  PurchaseOrderType
} from "@app/modules/purchases/entities/entities";
import { computePurchaseTotal } from "@app/modules/purchases/helpers/computePurchaseTotal";

// Convierte una cantidad/costo del formulario (string) a número seguro (>= 0, 0 si inválido).
function parseAmount(value: string): number {
  const parsed = Number(value.trim());
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

// Ítems del formulario → ítems persistibles. Descarta los que no tienen producto
// ni cantidad positiva (filas vacías dejadas por el usuario).
export function toPurchaseItems(items: PurchaseItemFormType[]): PurchaseItemType[] {
  return items
    .map((item) => ({
      productId: item.productId.trim(),
      quantity: parseAmount(item.quantity),
      unitCost: parseAmount(item.unitCost)
    }))
    .filter((item) => item.quantity > 0 || item.productId.length > 0);
}

// Formulario → datos persistibles. El total se calcula sobre los ítems.
export function toPurchaseInput(form: PurchaseFormType): PurchaseInputType {
  const items = toPurchaseItems(form.items);
  return {
    supplierId: form.supplierId.trim(),
    date: form.date.trim(),
    items: items,
    total: computePurchaseTotal(items),
    status: form.status,
    invoiceNumber: form.invoiceNumber.trim(),
    notes: form.notes.trim()
  };
}

// Orden existente → formulario (para edición).
export function formFromPurchase(purchase: PurchaseOrderType): PurchaseFormType {
  const items: PurchaseItemFormType[] =
    purchase.items.length > 0
      ? purchase.items.map((item) => ({
          productId: item.productId,
          quantity: String(item.quantity),
          unitCost: String(item.unitCost)
        }))
      : [{ productId: "", quantity: "", unitCost: "" }];

  return {
    supplierId: purchase.supplierId,
    date: purchase.date,
    status: purchase.status,
    invoiceNumber: purchase.invoiceNumber,
    notes: purchase.notes,
    items: items
  };
}
