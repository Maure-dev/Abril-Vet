import type {
  MedicalRecordFormErrorsType,
  MedicalRecordFormType
} from "@app/modules/medicalRecords/entities/entities";

// Valida una fecha ISO (yyyy-mm-dd) parseando por componentes para evitar el desfase
// de zona horaria de `new Date(str)`. Devuelve true si la fecha existe y round-trippea.
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

// Función pura: valida el formulario de historia clínica. Devuelve un mapa de errores por campo.
export function validateMedicalRecordForm(
  form: MedicalRecordFormType
): MedicalRecordFormErrorsType {
  const errors: MedicalRecordFormErrorsType = {};

  if (form.patientId.trim().length === 0) {
    errors.patientId = "Asociá el registro a un paciente";
  }

  if (form.date.trim().length === 0) {
    errors.date = "Ingresá la fecha de la consulta";
  } else if (!isValidIsoDate(form.date.trim())) {
    errors.date = "Fecha de consulta inválida";
  }

  if (form.reason.trim().length < 2) {
    errors.reason = "Ingresá el motivo de consulta";
  }

  if (form.nextControlDate.trim().length > 0 && !isValidIsoDate(form.nextControlDate.trim())) {
    errors.nextControlDate = "Fecha de próximo control inválida";
  }

  return errors;
}
