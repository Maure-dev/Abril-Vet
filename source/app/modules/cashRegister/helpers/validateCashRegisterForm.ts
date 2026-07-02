import type {
  CashCloseFormErrorsType,
  CashCloseFormType,
  CashMovementFormErrorsType,
  CashMovementFormType,
  CashRegisterFormErrorsType,
  CashRegisterFormType
} from "@app/modules/cashRegister/entities/entities";

// Función pura: valida el formulario de apertura de caja.
export function validateCashRegisterForm(form: CashRegisterFormType): CashRegisterFormErrorsType {
  const errors: CashRegisterFormErrorsType = {};

  const opening = Number(form.openingAmount);
  if (form.openingAmount.trim().length === 0) {
    errors.openingAmount = "Ingresá el monto de apertura";
  } else if (Number.isNaN(opening) || opening < 0) {
    errors.openingAmount = "El monto de apertura debe ser un número mayor o igual a 0";
  }

  return errors;
}

// Función pura: valida el formulario de un movimiento (ingreso / egreso).
export function validateCashMovementForm(form: CashMovementFormType): CashMovementFormErrorsType {
  const errors: CashMovementFormErrorsType = {};

  const amount = Number(form.amount);
  if (form.amount.trim().length === 0) {
    errors.amount = "Ingresá el monto del movimiento";
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = "El monto debe ser un número mayor a 0";
  }

  if (form.concept.trim().length === 0) {
    errors.concept = "Ingresá un concepto";
  }

  return errors;
}

// Función pura: valida el formulario de cierre (arqueo).
export function validateCashCloseForm(form: CashCloseFormType): CashCloseFormErrorsType {
  const errors: CashCloseFormErrorsType = {};

  const counted = Number(form.countedAmount);
  if (form.countedAmount.trim().length === 0) {
    errors.countedAmount = "Ingresá el efectivo contado";
  } else if (Number.isNaN(counted) || counted < 0) {
    errors.countedAmount = "El efectivo contado debe ser un número mayor o igual a 0";
  }

  return errors;
}
