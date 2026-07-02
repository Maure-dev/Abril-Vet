import { EMPTY_FORM } from "@app/modules/products/constants/constants";
import type { ProductFormType, ProductType } from "@app/modules/products/entities/entities";

// Factories de datos del módulo productos para tests.

export function buildProduct(overrides: Partial<ProductType> = {}): ProductType {
  return {
    id: "prod-1",
    code: "AV-100",
    barcode: "7790000000001",
    name: "Alimento balanceado",
    category: "food",
    brand: "MarcaX",
    supplierId: "sup-1",
    costPrice: 1000,
    salePrice: 1500,
    ivaPct: 21,
    stock: 10,
    minStock: 5,
    unit: "unidad",
    expirationDate: "2027-01-01",
    batch: "L-001",
    notes: "",
    imageUrl: null,
    isActive: true,
    ...overrides
  };
}

export function buildProductForm(overrides: Partial<ProductFormType> = {}): ProductFormType {
  return {
    ...EMPTY_FORM,
    code: "AV-100",
    name: "Alimento balanceado",
    salePrice: "1500",
    ...overrides
  };
}
