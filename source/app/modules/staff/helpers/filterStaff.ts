import type {
  RoleFilterType,
  StaffType,
  StatusFilterType
} from "@app/modules/staff/entities/entities";

// Función pura: filtra el personal por texto (nombre, apellido, email), por rol y por estado.
// Case-insensitive.
export function filterStaff(
  items: StaffType[],
  query: string,
  roleFilter: RoleFilterType,
  statusFilter: StatusFilterType
): StaffType[] {
  const q = query.trim().toLowerCase();
  return items.filter((s) => {
    if (roleFilter !== "all" && !s.roles.includes(roleFilter)) {
      return false;
    }
    if (statusFilter === "active" && !s.isActive) {
      return false;
    }
    if (statusFilter === "inactive" && s.isActive) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [s.firstName, s.lastName, s.email].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
