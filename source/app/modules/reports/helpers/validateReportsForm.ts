import type {
  ReportsFormErrorsType,
  ReportsFormType
} from "@app/modules/reports/entities/entities";

// Parsea una fecha ISO (yyyy-mm-dd) por componentes para evitar el desfase de timezone
// que introduce `new Date("yyyy-mm-dd")` (interpretada como UTC).
function parseIsoDate(value: string): Date | null {
  const parts = value.split("-");
  if (parts.length !== 3) {
    return null;
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? date : null;
}

// Función pura: valida el formulario del reporte. Devuelve un mapa de errores por campo.
export function validateReportsForm(form: ReportsFormType): ReportsFormErrorsType {
  const errors: ReportsFormErrorsType = {};

  if (form.label.trim().length < 2) {
    errors.label = "Ingresá un nombre para el reporte";
  }

  const from = form.fromDate.trim().length > 0 ? parseIsoDate(form.fromDate) : null;
  const to = form.toDate.trim().length > 0 ? parseIsoDate(form.toDate) : null;

  if (form.fromDate.trim().length > 0 && from === null) {
    errors.fromDate = "Fecha desde inválida";
  }
  if (form.toDate.trim().length > 0 && to === null) {
    errors.toDate = "Fecha hasta inválida";
  }
  if (from !== null && to !== null && from.getTime() > to.getTime()) {
    errors.toDate = "La fecha hasta no puede ser anterior a la fecha desde";
  }

  return errors;
}
