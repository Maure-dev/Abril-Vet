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
  address: string;
  city: string;
  notes: string;
  balance: string;
  isActive: boolean;
};

export type ClientFormErrorsType = Partial<Record<keyof ClientFormType, string>>;

// ── Estado de cuenta del cliente ──
// Vistas mínimas (sólo los campos que consume el detalle) de colecciones de otros módulos,
// leídas por nombre desde Firestore (no se importan sus tipos/servicios).

// Estado de una factura (comercial).
export type ClientInvoiceStatusType = "paid" | "partial" | "pending";

// Tipo y estado de un turno (compartido).
export type ClientAppointmentTypeType =
  | "consultation"
  | "surgery"
  | "vaccination"
  | "grooming"
  | "bath"
  | "other";

export type ClientAppointmentStatusType = "scheduled" | "confirmed" | "cancelled" | "done";

// Venta (POS) asociada al cliente.
export type ClientSaleType = {
  id: string;
  date: string; // ISO (yyyy-mm-dd)
  total: number; // ARS (entero)
};

// Factura asociada al cliente.
export type ClientInvoiceType = {
  id: string;
  date: string; // ISO (yyyy-mm-dd)
  total: number; // ARS (entero)
  paidAmount: number; // ARS (entero)
  status: ClientInvoiceStatusType;
};

// Turno (visita) asociado al cliente.
export type ClientAppointmentType = {
  id: string;
  date: string; // ISO datetime
  type: ClientAppointmentTypeType;
  status: ClientAppointmentStatusType;
  reason: string;
  patientId: string; // mascota de la visita
};

// Estado de cuenta completo devuelto por el service (una lectura por colección).
export type ClientAccountType = {
  sales: ClientSaleType[];
  invoices: ClientInvoiceType[];
  appointments: ClientAppointmentType[];
};

// Totales de facturación (lo facturado y lo pagado).
export type InvoiceSummaryType = {
  billed: number;
  paid: number;
};

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
  account: ClientAccountType | null;
  accountLoading: boolean;
};

export type ClientsContextType = {
  getClientsState: ClientsDataType;
  setClientsState: Dispatch<SetStateAction<ClientsDataType>>;
};
