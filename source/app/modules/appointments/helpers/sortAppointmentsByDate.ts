import type { AppointmentType } from "@app/modules/appointments/entities/entities";

// Función pura: ordena los turnos ascendentemente por fecha/hora (sin mutar el arreglo original).
export function sortAppointmentsByDate(items: AppointmentType[]): AppointmentType[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    const safeA = Number.isNaN(timeA) ? Number.POSITIVE_INFINITY : timeA;
    const safeB = Number.isNaN(timeB) ? Number.POSITIVE_INFINITY : timeB;
    return safeA - safeB;
  });
}
