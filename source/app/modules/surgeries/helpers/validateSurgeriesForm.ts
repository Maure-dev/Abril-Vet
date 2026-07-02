import type {
  SurgeryFormErrorsType,
  SurgeryFormType
} from "@app/modules/surgeries/entities/entities";

// Función pura: valida el formulario de cirugía. Devuelve un mapa de errores por campo.
export function validateSurgeriesForm(form: SurgeryFormType): SurgeryFormErrorsType {
  const errors: SurgeryFormErrorsType = {};

  if (form.patientId.trim().length === 0) {
    errors.patientId = "Asociá la cirugía a un paciente";
  }
  if (form.type.trim().length < 2) {
    errors.type = "Ingresá el tipo de cirugía";
  }

  // La fecha es opcional; si viene, debe ser un yyyy-mm-dd válido (parseo por componentes).
  if (form.date.trim().length > 0) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date.trim());
    if (!match) {
      errors.date = "Fecha inválida";
    } else {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const date = new Date(year, month - 1, day);
      const roundTrips =
        date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
      if (!roundTrips) {
        errors.date = "Fecha inválida";
      }
    }
  }

  return errors;
}
