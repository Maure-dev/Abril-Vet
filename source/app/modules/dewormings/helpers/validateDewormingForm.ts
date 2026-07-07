import type {
  DewormingFormErrorsType,
  DewormingFormType
} from "@app/modules/dewormings/entities/entities";

// Chequea que una fecha ISO (yyyy-mm-dd) sea válida parseando por componentes
// (evita el desfase de zona horaria de `new Date(str)`).
function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// Función pura: valida el formulario de desparasitación. Devuelve un mapa de errores por campo.
export function validateDewormingForm(form: DewormingFormType): DewormingFormErrorsType {
  const errors: DewormingFormErrorsType = {};

  if (form.patientId.trim().length === 0) {
    errors.patientId = "Asociá la desparasitación a un paciente";
  }
  if (form.productName.trim().length < 2) {
    errors.productName = "Ingresá el antiparasitario usado";
  }
  if (form.date.trim().length === 0) {
    errors.date = "Ingresá la fecha de aplicación";
  } else if (!isValidIsoDate(form.date.trim())) {
    errors.date = "Fecha de aplicación inválida";
  }
  if (form.nextDoseDate.trim().length > 0 && !isValidIsoDate(form.nextDoseDate.trim())) {
    errors.nextDoseDate = "Fecha de próxima dosis inválida";
  }

  return errors;
}
