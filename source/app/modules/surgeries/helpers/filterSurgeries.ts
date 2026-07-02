import type {
  SurgeryStatusFilterType,
  SurgeryType
} from "@app/modules/surgeries/entities/entities";

// Función pura: filtra cirugías por texto (tipo) y por estado. Case-insensitive.
export function filterSurgeries(
  items: SurgeryType[],
  query: string,
  statusFilter: SurgeryStatusFilterType
): SurgeryType[] {
  const q = query.trim().toLowerCase();
  return items.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return s.type.toLowerCase().includes(q);
  });
}
