// Función pura: calcula la cantidad de días de internación entre el ingreso y el alta.
// Si no hay alta (null o ""), usa `now`. El mínimo es 0 (nunca negativo). Devuelve un
// entero de días completos.
//
// Parseamos por componentes (no `new Date(str)`) para evitar el desfase de zona horaria:
// `new Date("2023-05-01")` es UTC y en TZ negativas cae el día anterior. `now` es
// inyectable para tests deterministas.
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // Rechaza fechas que no round-trippean (por ejemplo 2023-13-40).
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function computeStayDays(
  admissionDate: string,
  dischargeDate: string | null,
  now: Date = new Date()
): number {
  const admission = parseIsoDate(admissionDate);
  if (!admission) {
    return 0;
  }

  const hasDischarge = dischargeDate !== null && dischargeDate.trim().length > 0;
  const discharge = hasDischarge ? parseIsoDate(dischargeDate) : null;
  // Normalizamos `now` a medianoche local para comparar por día completo.
  const end = discharge ?? new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diff = Math.floor((end.getTime() - admission.getTime()) / MS_PER_DAY);
  return diff < 0 ? 0 : diff;
}
