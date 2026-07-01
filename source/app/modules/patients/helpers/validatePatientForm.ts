import type {
  PatientFormErrorsType,
  PatientFormType
} from "@app/modules/patients/entities/entities";

// Función pura: valida el formulario de paciente. Devuelve un mapa de errores por campo.
export function validatePatientForm(form: PatientFormType): PatientFormErrorsType {
  const errors: PatientFormErrorsType = {};

  if (form.name.trim().length < 2) {
    errors.name = "Ingresá el nombre del paciente";
  }
  if (form.clientId.trim().length === 0) {
    errors.clientId = "Asociá el paciente a un cliente";
  }

  if (form.weightKg.trim().length > 0) {
    const weight = Number(form.weightKg);
    if (Number.isNaN(weight) || weight <= 0) {
      errors.weightKg = "El peso debe ser un número mayor a 0";
    }
  }

  if (form.birthDate.trim().length > 0) {
    const date = new Date(form.birthDate);
    if (Number.isNaN(date.getTime())) {
      errors.birthDate = "Fecha de nacimiento inválida";
    } else if (date.getTime() > Date.now()) {
      errors.birthDate = "La fecha de nacimiento no puede ser futura";
    }
  }

  return errors;
}
