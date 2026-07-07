import type { Dispatch, SetStateAction } from "react";

// Filtro de estado en la lista ("all" = todos).
export type SupplierStatusFilterType = "all" | "active" | "inactive";

// Modo de la página (lista / alta / edición / ficha).
export type SuppliersModeType = "list" | "create" | "edit" | "detail";

// ── Proveedor ──
export type SupplierType = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  cuit: string;
  notes: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type SupplierInputType = Omit<SupplierType, "id" | "createdAt" | "updatedAt">;

// ── Formulario ──
export type SupplierFormType = {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  cuit: string;
  notes: string;
  isActive: boolean;
};

export type SupplierFormErrorsType = Partial<Record<keyof SupplierFormType, string>>;

// ── Estado y contexto del módulo ──
export type SuppliersDataType = {
  items: SupplierType[];
  loading: boolean;
  query: string;
  statusFilter: SupplierStatusFilterType;
  mode: SuppliersModeType;
  selected: SupplierType | null;
  form: SupplierFormType;
  errors: SupplierFormErrorsType;
  saving: boolean;
};

export type SuppliersContextType = {
  getSuppliersState: SuppliersDataType;
  setSuppliersState: Dispatch<SetStateAction<SuppliersDataType>>;
};
