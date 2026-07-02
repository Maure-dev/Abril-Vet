// Función pura: indica si un recordatorio está vencido (dueDate anterior a hoy).
// Parsea por componentes (yyyy-mm-dd) para evitar desfase de timezone.
export function isReminderOverdue(dueDate: string, now: Date = new Date()): boolean {
  const trimmed = dueDate.trim();
  const parts = trimmed.split("-");
  if (parts.length !== 3) {
    return false;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return false;
  }

  // Vencimiento a medianoche local (componentes) vs. hoy a medianoche local.
  const due = new Date(year, month - 1, day).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return due < today;
}
