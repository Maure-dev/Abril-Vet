import type {
  DewormingStatusFilterType,
  DewormingType
} from "@app/modules/dewormings/entities/entities";
import { computeDewormingStatus } from "@app/modules/dewormings/helpers/computeDewormingStatus";

// Función pura: filtra desparasitaciones por texto (antiparasitario) y por estado calculado.
// Case-insensitive. `now` es inyectable para tests deterministas.
export function filterDewormings(
  items: DewormingType[],
  query: string,
  statusFilter: DewormingStatusFilterType,
  now: Date = new Date()
): DewormingType[] {
  const q = query.trim().toLowerCase();
  return items.filter((d) => {
    if (statusFilter !== "all" && computeDewormingStatus(d.nextDoseDate, now) !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return d.productName.toLowerCase().includes(q);
  });
}
