import { EMPTY_FORM } from "@app/modules/sales/constants/constants";
import type { SaleFormType, SaleItemType, SaleType } from "@app/modules/sales/entities/entities";

// Factories de datos del módulo ventas para tests.

export function buildSaleItem(overrides: Partial<SaleItemType> = {}): SaleItemType {
  return {
    kind: "product",
    refId: "prod-1",
    name: "Alimento premium 3kg",
    quantity: 2,
    unitPrice: 5000,
    ...overrides
  };
}

export function buildSale(overrides: Partial<SaleType> = {}): SaleType {
  return {
    id: "sale-1",
    clientId: "cli-1",
    date: "2026-07-01",
    items: [buildSaleItem()],
    discount: 0,
    subtotal: 10000,
    total: 10000,
    paymentMethod: "cash",
    ...overrides
  };
}

export function buildSaleForm(overrides: Partial<SaleFormType> = {}): SaleFormType {
  return {
    ...EMPTY_FORM,
    clientId: "cli-1",
    date: "2026-07-01",
    items: [buildSaleItem()],
    ...overrides
  };
}
