// Helpers de fechas para vistas de calendario semanal (puros, compartidos por módulos).
// Se parsea por componentes (año, mes, día) para evitar corrimientos por timezone.

const pad = (n: number): string => String(n).padStart(2, "0");

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function format(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Fecha de hoy en formato yyyy-mm-dd (local).
export function todayStr(): string {
  return format(new Date());
}

// Suma (o resta) días a una fecha yyyy-mm-dd y devuelve yyyy-mm-dd.
export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return format(date);
}

// Lunes de la semana que contiene a la fecha dada (semana de lunes a domingo).
export function startOfWeek(dateStr: string): string {
  const date = parseDate(dateStr);
  const dayOfWeek = date.getDay(); // 0 = domingo … 6 = sábado
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + diff);
  return format(date);
}

// Los 7 días (yyyy-mm-dd) de la semana que arranca en weekStart.
export function weekDays(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}
