import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type PurchaseStatusType = "draft" | "ordered" | "received" | "cancelled";

// Filtro de estado en la lista ("all" = todos).
export type PurchaseStatusFilterType = PurchaseStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type PurchasesModeType = "list" | "create" | "edit" | "detail";

// ── Ítem de una orden de compra ──
export type PurchaseItemType = {
  productId: string; // referencia al producto (por ID, no importamos el módulo)
  quantity: number;
  unitCost: number; // costo unitario en ARS (entero)
};

// ── Orden de compra ──
export type PurchaseOrderType = {
  id: string;
  supplierId: string; // proveedor (por ID)
  date: string; // ISO (yyyy-mm-dd)
  items: PurchaseItemType[];
  total: number; // total en ARS (calculado sobre los ítems)
  status: PurchaseStatusType;
  invoiceNumber: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type PurchaseInputType = Omit<PurchaseOrderType, "id" | "createdAt" | "updatedAt">;

// ── Formulario ──
// Los ítems se editan como strings (inputs) y se convierten al persistir.
export type PurchaseItemFormType = {
  productId: string;
  quantity: string;
  unitCost: string;
};

export type PurchaseFormType = {
  supplierId: string;
  date: string;
  status: PurchaseStatusType;
  invoiceNumber: string;
  notes: string;
  items: PurchaseItemFormType[];
};

export type PurchaseFormErrorsType = Partial<Record<keyof PurchaseFormType, string>>;

// ── Estado y contexto del módulo ──
export type PurchasesDataType = {
  items: PurchaseOrderType[];
  loading: boolean;
  query: string;
  statusFilter: PurchaseStatusFilterType;
  mode: PurchasesModeType;
  selected: PurchaseOrderType | null;
  form: PurchaseFormType;
  errors: PurchaseFormErrorsType;
  saving: boolean;
};

export type PurchasesContextType = {
  getPurchasesState: PurchasesDataType;
  setPurchasesState: Dispatch<SetStateAction<PurchasesDataType>>;
};
