import { EMPTY_FORM } from "@app/modules/purchases/constants/constants";
import type {
  PurchaseFormType,
  PurchaseItemType,
  PurchaseOrderType
} from "@app/modules/purchases/entities/entities";

// Factories de datos del módulo compras para tests.

export function buildPurchaseItem(overrides: Partial<PurchaseItemType> = {}): PurchaseItemType {
  return {
    productId: "prod-1",
    quantity: 2,
    unitCost: 1500,
    ...overrides
  };
}

export function buildPurchase(overrides: Partial<PurchaseOrderType> = {}): PurchaseOrderType {
  return {
    id: "pur-1",
    supplierId: "sup-1",
    date: "2026-06-01",
    items: [buildPurchaseItem()],
    total: 3000,
    status: "ordered",
    invoiceNumber: "A-0001",
    notes: "",
    ...overrides
  };
}

export function buildPurchaseForm(overrides: Partial<PurchaseFormType> = {}): PurchaseFormType {
  return {
    ...EMPTY_FORM,
    supplierId: "sup-1",
    items: [{ productId: "prod-1", quantity: "2", unitCost: "1500" }],
    ...overrides
  };
}
