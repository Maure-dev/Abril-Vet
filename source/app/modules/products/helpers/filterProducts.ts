import type {
  CategoryFilterType,
  ProductType,
  StatusFilterType
} from "@app/modules/products/entities/entities";

// Función pura: filtra productos por texto (nombre, código, código de barras),
// por categoría y por estado (activo/inactivo). Case-insensitive.
export function filterProducts(
  items: ProductType[],
  query: string,
  categoryFilter: CategoryFilterType,
  statusFilter: StatusFilterType
): ProductType[] {
  const q = query.trim().toLowerCase();
  return items.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) {
      return false;
    }
    if (statusFilter === "active" && !p.isActive) {
      return false;
    }
    if (statusFilter === "inactive" && p.isActive) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [p.name, p.code, p.barcode].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
