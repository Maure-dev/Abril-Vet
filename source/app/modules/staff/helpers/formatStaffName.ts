import type { StaffType } from "@app/modules/staff/entities/entities";

// Función pura: arma el nombre completo del personal ("Apellido, Nombre").
// Tolera espacios sobrantes y campos vacíos.
export function formatStaffName(staff: Pick<StaffType, "firstName" | "lastName">): string {
  const first = staff.firstName.trim();
  const last = staff.lastName.trim();
  if (first.length === 0 && last.length === 0) {
    return "";
  }
  if (last.length === 0) {
    return first;
  }
  if (first.length === 0) {
    return last;
  }
  return `${last}, ${first}`;
}
