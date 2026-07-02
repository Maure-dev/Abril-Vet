import type {
  CashSessionType,
  CashStatusFilterType
} from "@app/modules/cashRegister/entities/entities";

// Función pura: filtra sesiones de caja por texto (fechas, notas) y por estado.
// Case-insensitive.
export function filterCashSessions(
  items: CashSessionType[],
  query: string,
  statusFilter: CashStatusFilterType
): CashSessionType[] {
  const q = query.trim().toLowerCase();
  return items.filter((session) => {
    if (statusFilter !== "all" && session.status !== statusFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [session.openedAt, session.closedAt, session.notes].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
