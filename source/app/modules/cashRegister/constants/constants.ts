import type {
  CashCloseFormType,
  CashMovementFormType,
  CashMovementTypeType,
  CashRegisterDataType,
  CashRegisterFormType,
  CashStatusType
} from "@app/modules/cashRegister/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const CASH_STATUS_LABELS: Record<CashStatusType, string> = {
  open: "Abierta",
  closed: "Cerrada"
};

export const CASH_MOVEMENT_TYPE_LABELS: Record<CashMovementTypeType, string> = {
  income: "Ingreso",
  expense: "Egreso"
};

// Formulario vacío (apertura de caja).
export const EMPTY_FORM: CashRegisterFormType = {
  openingAmount: "",
  notes: ""
};

// Formulario vacío (nuevo movimiento).
export const EMPTY_MOVEMENT_FORM: CashMovementFormType = {
  type: "income",
  amount: "",
  concept: ""
};

// Formulario vacío (cierre / arqueo).
export const EMPTY_CLOSE_FORM: CashCloseFormType = {
  countedAmount: ""
};

export const INITIAL_STATE = {
  CASH_REGISTER_PAGE: {
    items: [],
    activeSession: null,
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    movementForm: EMPTY_MOVEMENT_FORM,
    movementErrors: {},
    closeForm: EMPTY_CLOSE_FORM,
    closeErrors: {},
    saving: false
  } satisfies CashRegisterDataType
};
