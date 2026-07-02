import type { Dispatch, SetStateAction } from "react";

// Filtro de estado en la lista ("all" = todos).
export type StatusFilterType = "all" | "active" | "inactive";

// Modo de la página (lista / alta / edición / ficha).
export type ClientsModeType = "list" | "create" | "edit" | "detail";

// ── Cliente (dueño de mascotas) ──
export type ClientType = {
  id: string;
  firstName: string;
  lastName: string;
  docId: string; // DNI / CUIT
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  notes: string;
  isActive: boolean;
  balance: number; // saldo en ARS (entero)
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type ClientInputType = Omit<ClientType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (campos como string para los inputs; salvo isActive) ──
export type ClientFormType = {
  firstName: string;
  lastName: string;
  docId: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  notes: string;
  balance: string;
  isActive: boolean;
};

export type ClientFormErrorsType = Partial<Record<keyof ClientFormType, string>>;

// ── Estado y contexto del módulo ──
export type ClientsDataType = {
  items: ClientType[];
  loading: boolean;
  query: string;
  statusFilter: StatusFilterType;
  mode: ClientsModeType;
  selected: ClientType | null;
  form: ClientFormType;
  errors: ClientFormErrorsType;
  saving: boolean;
};

export type ClientsContextType = {
  getClientsState: ClientsDataType;
  setClientsState: Dispatch<SetStateAction<ClientsDataType>>;
};
