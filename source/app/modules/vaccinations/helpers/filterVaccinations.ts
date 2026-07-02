import type {
  VaccinationType,
  VaccineStatusFilterType
} from "@app/modules/vaccinations/entities/entities";
import { computeVaccineStatus } from "@app/modules/vaccinations/helpers/computeVaccineStatus";

// Función pura: filtra vacunaciones por texto (nombre de vacuna) y por estado calculado.
// Case-insensitive. `now` es inyectable para tests deterministas.
export function filterVaccinations(
  items: VaccinationType[],
  query: string,
  statusFilter: VaccineStatusFilterType,
  now: Date = new Date()
): VaccinationType[] {
  const q = query.trim().toLowerCase();
  return items.filter((v) => {
    if (statusFilter !== "all" && computeVaccineStatus(v.nextDoseDate, now) !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return v.vaccineName.toLowerCase().includes(q);
  });
}
