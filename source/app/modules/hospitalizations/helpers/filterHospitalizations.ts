import type {
  HospitalizationStatusFilterType,
  HospitalizationType
} from "@app/modules/hospitalizations/entities/entities";

// Función pura: filtra internaciones por texto (motivo) y por estado. Case-insensitive.
export function filterHospitalizations(
  items: HospitalizationType[],
  query: string,
  statusFilter: HospitalizationStatusFilterType
): HospitalizationType[] {
  const q = query.trim().toLowerCase();
  return items.filter((h) => {
    if (statusFilter !== "all" && h.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return h.reason.toLowerCase().includes(q);
  });
}
