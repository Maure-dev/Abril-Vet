import type {
  ReminderStatusFilterType,
  ReminderType,
  ReminderTypeFilterType
} from "@app/modules/reminders/entities/entities";

// Función pura: filtra recordatorios por texto (mensaje) y por tipo/estado. Case-insensitive.
export function filterReminders(
  items: ReminderType[],
  query: string,
  typeFilter: ReminderTypeFilterType,
  statusFilter: ReminderStatusFilterType
): ReminderType[] {
  const q = query.trim().toLowerCase();
  return items.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) {
      return false;
    }
    if (statusFilter !== "all" && r.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return r.message.toLowerCase().includes(q);
  });
}
