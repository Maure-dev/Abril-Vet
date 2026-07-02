import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──

// Tipo de línea del carrito: producto o servicio.
export type SaleItemKindType = "product" | "service";

// Medio de pago de la venta.
export type PaymentMethodType = "cash" | "card" | "transfer" | "mixed";

// Modo de la página (lista / alta / edición / ficha).
export type SalesModeType = "list" | "create" | "edit" | "detail";

// ── Línea del carrito ──
export type SaleItemType = {
  kind: SaleItemKindType;
  refId: string; // referencia al producto/servicio por ID (opcional)
  name: string;
  quantity: number;
  unitPrice: number; // ARS (entero)
};

// ── Venta (POS) ──
export type SaleType = {
  id: string;
  clientId: string | null; // cliente asociado (puede ser venta al público)
  date: string; // ISO (yyyy-mm-dd)
  items: SaleItemType[];
  discount: number; // ARS (entero)
  subtotal: number; // ARS (entero)
  total: number; // ARS (entero)
  paymentMethod: PaymentMethodType;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type SaleInputType = Omit<SaleType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (arma el carrito antes de confirmar la venta) ──

// Borrador de una línea nueva (todos los campos como string para los inputs).
export type SaleItemDraftType = {
  kind: SaleItemKindType;
  refId: string;
  name: string;
  quantity: string;
  unitPrice: string;
};

export type SaleFormType = {
  clientId: string;
  date: string;
  paymentMethod: PaymentMethodType;
  discount: string;
  items: SaleItemType[]; // líneas ya agregadas al carrito
  draft: SaleItemDraftType; // línea en edición (aún sin agregar)
};

export type SaleFormErrorsType = Partial<Record<keyof SaleFormType, string>>;

// ── Estado y contexto del módulo ──
export type SalesDataType = {
  items: SaleType[];
  loading: boolean;
  query: string;
  mode: SalesModeType;
  selected: SaleType | null;
  form: SaleFormType;
  errors: SaleFormErrorsType;
  saving: boolean;
};

export type SalesContextType = {
  getSalesState: SalesDataType;
  setSalesState: Dispatch<SetStateAction<SalesDataType>>;
};
