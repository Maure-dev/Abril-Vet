// Chequea que un turno no pise el horario de otro turno del mismo veterinario.

type CandidateType = { vetId: string; date: string; durationMin: string };
type ConflictItemType = {
  id: string;
  vetId: string;
  date: string;
  durationMin: number;
  status: string;
};

function toTime(iso: string): number {
  return new Date(iso).getTime();
}

// Devuelve el turno en conflicto (mismo veterinario, horario solapado) o null.
// Sin veterinario o sin fecha no hay nada que chequear. Ignora cancelados y el propio turno (excludeId).
export function findAppointmentConflict(
  candidate: CandidateType,
  items: ConflictItemType[],
  excludeId: string
): ConflictItemType | null {
  if (!candidate.vetId || !candidate.date) {
    return null;
  }
  const start = toTime(candidate.date);
  if (Number.isNaN(start)) {
    return null;
  }
  const end = start + (Number(candidate.durationMin) || 0) * 60000;

  for (const item of items) {
    if (item.id === excludeId || item.vetId !== candidate.vetId || item.status === "cancelled") {
      continue;
    }
    const itemStart = toTime(item.date);
    if (Number.isNaN(itemStart)) {
      continue;
    }
    const itemEnd = itemStart + item.durationMin * 60000;
    // Mismo inicio exacto, o intervalos [inicio, fin) que se solapan.
    if (itemStart === start || (start < itemEnd && itemStart < end)) {
      return item;
    }
  }
  return null;
}
