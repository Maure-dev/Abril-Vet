import type {
  SupplierStatusFilterType,
  SupplierType
} from "@app/modules/suppliers/entities/entities";

// Función pura: filtra proveedores por texto (nombre, CUIT, email) y por estado.
// Case-insensitive.
export function filterSuppliers(
  items: SupplierType[],
  query: string,
  statusFilter: SupplierStatusFilterType
): SupplierType[] {
  const q = query.trim().toLowerCase();
  return items.filter((s) => {
    if (statusFilter === "active" && !s.isActive) {
      return false;
    }
    if (statusFilter === "inactive" && s.isActive) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [s.name, s.cuit, s.email].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
