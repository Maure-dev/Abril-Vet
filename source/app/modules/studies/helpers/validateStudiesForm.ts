import type { StudyFormErrorsType, StudyFormType } from "@app/modules/studies/entities/entities";

// Función pura: valida el formulario de estudio. Devuelve un mapa de errores por campo.
export function validateStudiesForm(form: StudyFormType): StudyFormErrorsType {
  const errors: StudyFormErrorsType = {};

  if (form.patientId.trim().length === 0) {
    errors.patientId = "Asociá el estudio a un paciente";
  }
  if (form.name.trim().length < 2) {
    errors.name = "Ingresá el nombre del estudio";
  }

  if (form.date.trim().length > 0) {
    // Parseamos por componentes (no `new Date(str)`) para evitar el desfase de zona horaria.
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date.trim());
    if (!match) {
      errors.date = "Fecha inválida";
    } else {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const parsed = new Date(year, month - 1, day);
      const isValid =
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day;
      if (!isValid) {
        errors.date = "Fecha inválida";
      }
    }
  }

  return errors;
}
