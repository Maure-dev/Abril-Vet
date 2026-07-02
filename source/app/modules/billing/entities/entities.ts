import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type PaymentMethodType = "cash" | "card" | "transfer" | "mixed";
export type InvoiceStatusType = "paid" | "partial" | "pending";

// Filtro de estado en la lista ("all" = todos).
export type InvoiceStatusFilterType = InvoiceStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type BillingModeType = "list" | "create" | "edit" | "detail";

// ── Ítem de factura ──
export type InvoiceItemType = {
  description: string;
  quantity: number;
  unitPrice: number; // ARS entero
};

// ── Factura ──
export type InvoiceType = {
  id: string;
  clientId: string; // cliente facturado
  date: string; // ISO (yyyy-mm-dd)
  items: InvoiceItemType[];
  discount: number; // ARS entero
  subtotal: number; // ARS entero
  total: number; // ARS entero
  paymentMethod: PaymentMethodType;
  status: InvoiceStatusType;
  paidAmount: number; // ARS entero
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type InvoiceInputType = Omit<InvoiceType, "id" | "createdAt" | "updatedAt">;

// ── Formulario ──
// Los ítems se manejan como una lista dinámica de filas de texto (inputs).
export type InvoiceItemFormType = {
  description: string;
  quantity: string;
  unitPrice: string;
};

export type BillingFormType = {
  clientId: string;
  date: string;
  items: InvoiceItemFormType[];
  discount: string;
  paymentMethod: PaymentMethodType;
  status: InvoiceStatusType;
  paidAmount: string;
  notes: string;
};

export type BillingFormErrorsType = Partial<Record<keyof BillingFormType, string>>;

// ── Estado y contexto del módulo ──
export type BillingDataType = {
  items: InvoiceType[];
  loading: boolean;
  query: string;
  statusFilter: InvoiceStatusFilterType;
  mode: BillingModeType;
  selected: InvoiceType | null;
  form: BillingFormType;
  errors: BillingFormErrorsType;
  saving: boolean;
};

export type BillingContextType = {
  getBillingState: BillingDataType;
  setBillingState: Dispatch<SetStateAction<BillingDataType>>;
};
