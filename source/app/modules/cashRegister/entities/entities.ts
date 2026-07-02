import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type CashStatusType = "open" | "closed";
export type CashMovementTypeType = "income" | "expense";

// Filtro de estado en la lista ("all" = todas).
export type CashStatusFilterType = CashStatusType | "all";

// Modo de la página (lista / apertura / edición / ficha).
export type CashRegisterModeType = "list" | "create" | "edit" | "detail";

// ── Movimiento de caja (ingreso / egreso) ──
export type CashMovementType = {
  type: CashMovementTypeType;
  amount: number; // ARS
  concept: string;
  at: string; // ISO datetime
};

// ── Sesión de caja (apertura → movimientos → cierre) ──
export type CashSessionType = {
  id: string;
  openedAt: string; // ISO datetime
  closedAt: string; // ISO datetime | "" (vacío si está abierta)
  status: CashStatusType;
  openingAmount: number; // ARS
  countedAmount: number | null; // efectivo contado al cierre
  movements: CashMovementType[];
  expectedAmount: number; // calculado (opening + ingresos - egresos)
  difference: number; // countedAmount - expectedAmount
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type CashSessionInputType = Omit<CashSessionType, "id" | "createdAt" | "updatedAt">;

// ── Formulario de apertura (todos los campos como string para los inputs) ──
export type CashRegisterFormType = {
  openingAmount: string;
  notes: string;
};

export type CashRegisterFormErrorsType = Partial<Record<keyof CashRegisterFormType, string>>;

// ── Formulario de movimiento (ingreso / egreso) ──
export type CashMovementFormType = {
  type: CashMovementTypeType;
  amount: string;
  concept: string;
};

export type CashMovementFormErrorsType = Partial<Record<keyof CashMovementFormType, string>>;

// ── Formulario de cierre (arqueo) ──
export type CashCloseFormType = {
  countedAmount: string;
};

export type CashCloseFormErrorsType = Partial<Record<keyof CashCloseFormType, string>>;

// ── Estado y contexto del módulo ──
export type CashRegisterDataType = {
  items: CashSessionType[];
  activeSession: CashSessionType | null;
  loading: boolean;
  query: string;
  statusFilter: CashStatusFilterType;
  mode: CashRegisterModeType;
  selected: CashSessionType | null;
  form: CashRegisterFormType;
  errors: CashRegisterFormErrorsType;
  movementForm: CashMovementFormType;
  movementErrors: CashMovementFormErrorsType;
  closeForm: CashCloseFormType;
  closeErrors: CashCloseFormErrorsType;
  saving: boolean;
};

export type CashRegisterContextType = {
  getCashRegisterState: CashRegisterDataType;
  setCashRegisterState: Dispatch<SetStateAction<CashRegisterDataType>>;
};
