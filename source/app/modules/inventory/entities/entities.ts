import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
// Tipo de movimiento de stock: entrada, salida, ajuste o transferencia.
export type MovementTypeType = "in" | "out" | "adjustment" | "transfer";

// Filtro de tipo en la lista ("all" = todos).
export type MovementTypeFilterType = MovementTypeType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type InventoryModeType = "list" | "create" | "edit" | "detail";

// ── Movimiento de stock ──
export type StockMovementType = {
  id: string;
  productId: string; // referencia al producto (por ID)
  type: MovementTypeType;
  quantity: number;
  reason: string;
  date: string; // ISO (yyyy-mm-dd)
  warehouse: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type StockMovementInputType = Omit<StockMovementType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type MovementFormType = {
  productId: string;
  type: MovementTypeType;
  quantity: string;
  reason: string;
  date: string;
  warehouse: string;
  notes: string;
};

export type MovementFormErrorsType = Partial<Record<keyof MovementFormType, string>>;

// ── Estado y contexto del módulo ──
export type InventoryDataType = {
  items: StockMovementType[];
  loading: boolean;
  query: string;
  typeFilter: MovementTypeFilterType;
  mode: InventoryModeType;
  selected: StockMovementType | null;
  form: MovementFormType;
  errors: MovementFormErrorsType;
  saving: boolean;
};

export type InventoryContextType = {
  getInventoryState: InventoryDataType;
  setInventoryState: Dispatch<SetStateAction<InventoryDataType>>;
};
