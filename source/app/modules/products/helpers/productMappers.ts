import type {
  ProductFormType,
  ProductInputType,
  ProductType
} from "@app/modules/products/entities/entities";

// Convierte un campo numérico del formulario (string) a número, con fallback.
// Devuelve `fallback` si está vacío o es inválido/negativo.
export function parseNumber(value: string, fallback: number): number {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return fallback;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

// Formulario → datos persistibles. `base` aporta los campos que no están en el form
// (imageUrl, isActive), tomados del producto existente en edición.
export function toProductInput(
  form: ProductFormType,
  base: { imageUrl?: string | null; isActive?: boolean } = {}
): ProductInputType {
  return {
    code: form.code.trim(),
    barcode: form.barcode.trim(),
    name: form.name.trim(),
    category: form.category,
    brand: form.brand.trim(),
    supplierId: form.supplierId.trim(),
    costPrice: parseNumber(form.costPrice, 0),
    salePrice: parseNumber(form.salePrice, 0),
    ivaPct: parseNumber(form.ivaPct, 0),
    stock: parseNumber(form.stock, 0),
    minStock: parseNumber(form.minStock, 0),
    unit: form.unit.trim(),
    expirationDate: form.expirationDate.trim(),
    batch: form.batch.trim(),
    notes: form.notes.trim(),
    imageUrl: base.imageUrl ?? null,
    isActive: base.isActive ?? true
  };
}

// Producto existente → formulario (para edición).
export function formFromProduct(product: ProductType): ProductFormType {
  return {
    code: product.code,
    barcode: product.barcode,
    name: product.name,
    category: product.category,
    brand: product.brand,
    supplierId: product.supplierId,
    costPrice: String(product.costPrice),
    salePrice: String(product.salePrice),
    ivaPct: String(product.ivaPct),
    stock: String(product.stock),
    minStock: String(product.minStock),
    unit: product.unit,
    expirationDate: product.expirationDate,
    batch: product.batch,
    notes: product.notes
  };
}
