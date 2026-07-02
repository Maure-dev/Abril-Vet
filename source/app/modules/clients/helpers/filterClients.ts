import type { ClientType, StatusFilterType } from "@app/modules/clients/entities/entities";

// Función pura: filtra clientes por texto (nombre, apellido, documento, email, teléfono)
// y por estado (activo/inactivo). Case-insensitive.
export function filterClients(
  items: ClientType[],
  query: string,
  statusFilter: StatusFilterType
): ClientType[] {
  const q = query.trim().toLowerCase();
  return items.filter((c) => {
    if (statusFilter === "active" && !c.isActive) {
      return false;
    }
    if (statusFilter === "inactive" && c.isActive) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [c.firstName, c.lastName, c.docId, c.email, c.phone].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
