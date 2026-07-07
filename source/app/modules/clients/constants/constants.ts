import type {
  ClientAppointmentStatusType,
  ClientAppointmentTypeType,
  ClientFormType,
  ClientInvoiceStatusType,
  ClientsDataType,
  StatusFilterType
} from "@app/modules/clients/entities/entities";

// Etiquetas en español para el filtro de estado (sin enum: mapa tipado).
export const STATUS_FILTER_LABELS: Record<StatusFilterType, string> = {
  all: "Todos los estados",
  active: "Activos",
  inactive: "Inactivos"
};

// Etiquetas y tonos del estado de cuenta (copias locales: no se importan otros módulos).
export const INVOICE_STATUS_LABELS: Record<ClientInvoiceStatusType, string> = {
  paid: "Pagada",
  partial: "Parcial",
  pending: "Pendiente"
};

export const INVOICE_STATUS_TONE: Record<ClientInvoiceStatusType, "success" | "warning" | "error"> =
  {
    paid: "success",
    partial: "warning",
    pending: "error"
  };

export const APPOINTMENT_TYPE_LABELS: Record<ClientAppointmentTypeType, string> = {
  consultation: "Consulta",
  surgery: "Cirugía",
  vaccination: "Vacunación",
  grooming: "Peluquería",
  bath: "Baño",
  other: "Otro"
};

export const APPOINTMENT_STATUS_LABELS: Record<ClientAppointmentStatusType, string> = {
  scheduled: "Programado",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  done: "Realizado"
};

export const APPOINTMENT_STATUS_TONE: Record<
  ClientAppointmentStatusType,
  "neutral" | "info" | "success" | "error"
> = {
  scheduled: "info",
  confirmed: "success",
  cancelled: "error",
  done: "neutral"
};

// Cantidad de ítems que se muestran en las listas del estado de cuenta ("últimas…").
export const ACCOUNT_LIST_LIMIT = 5;

// Formulario vacío (alta de cliente).
export const EMPTY_FORM: ClientFormType = {
  firstName: "",
  lastName: "",
  docId: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
  balance: "0",
  isActive: true
};

export const INITIAL_STATE = {
  CLIENTS_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false,
    account: null,
    accountLoading: false
  } satisfies ClientsDataType
};
