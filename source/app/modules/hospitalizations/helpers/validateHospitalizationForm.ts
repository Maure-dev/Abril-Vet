import type {
  HospitalizationFormErrorsType,
  HospitalizationFormType
} from "@app/modules/hospitalizations/entities/entities";

// Chequea que una cadena tenga forma de fecha ISO (yyyy-mm-dd) válida y round-trippeable.
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

// Función pura: valida el formulario de internación. Devuelve un mapa de errores por campo.
export function validateHospitalizationForm(
  form: HospitalizationFormType
): HospitalizationFormErrorsType {
  const errors: HospitalizationFormErrorsType = {};

  if (form.patientId.trim().length === 0) {
    errors.patientId = "Asociá la internación a un paciente";
  }

  if (form.admissionDate.trim().length === 0) {
    errors.admissionDate = "Ingresá la fecha de ingreso";
  } else if (!isValidIsoDate(form.admissionDate.trim())) {
    errors.admissionDate = "Fecha de ingreso inválida";
  }

  if (form.reason.trim().length < 2) {
    errors.reason = "Ingresá el motivo de la internación";
  }

  if (form.dischargeDate.trim().length > 0) {
    if (!isValidIsoDate(form.dischargeDate.trim())) {
      errors.dischargeDate = "Fecha de alta inválida";
    } else if (
      isValidIsoDate(form.admissionDate.trim()) &&
      form.dischargeDate.trim() < form.admissionDate.trim()
    ) {
      errors.dischargeDate = "El alta no puede ser anterior al ingreso";
    }
  }

  return errors;
}
