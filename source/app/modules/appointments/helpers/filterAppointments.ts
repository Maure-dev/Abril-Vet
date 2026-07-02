import type {
  AppointmentStatusFilterType,
  AppointmentType,
  AppointmentTypeFilterType
} from "@app/modules/appointments/entities/entities";

// Función pura: filtra turnos por texto (motivo) y por tipo y estado. Case-insensitive.
export function filterAppointments(
  items: AppointmentType[],
  query: string,
  typeFilter: AppointmentTypeFilterType,
  statusFilter: AppointmentStatusFilterType
): AppointmentType[] {
  const q = query.trim().toLowerCase();
  return items.filter((a) => {
    if (typeFilter !== "all" && a.type !== typeFilter) {
      return false;
    }
    if (statusFilter !== "all" && a.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return a.reason.toLowerCase().includes(q);
  });
}
