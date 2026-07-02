import type { VaccineStatusType } from "@app/modules/vaccinations/entities/entities";

// Función pura: calcula el estado de una vacuna a partir de su próxima dosis.
// - Sin próxima dosis => "applied" (no hay refuerzo pendiente).
// - Próxima dosis anterior a hoy => "overdue".
// - Próxima dosis hoy o futura => "pending".
// `now` es inyectable para tests deterministas.
//
// Parseamos por componentes (no `new Date(str)`) para evitar el desfase de zona horaria:
// `new Date("2023-05-01")` es UTC y en TZ negativas cae el día anterior.
export function computeVaccineStatus(
  nextDoseDate: string,
  now: Date = new Date()
): VaccineStatusType {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(nextDoseDate);
  if (!match) {
    return "applied";
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const next = new Date(year, month - 1, day);
  // Rechaza fechas que no round-trippean (por ejemplo 2023-13-40): las tratamos como sin dato.
  if (next.getFullYear() !== year || next.getMonth() !== month - 1 || next.getDate() !== day) {
    return "applied";
  }

  // Comparamos a nivel de día (ignoramos la hora) para que "hoy" cuente como pendiente.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (next.getTime() < today.getTime()) {
    return "overdue";
  }
  return "pending";
}
