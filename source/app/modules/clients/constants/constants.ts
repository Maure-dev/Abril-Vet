import type {
  ClientFormType,
  ClientsDataType,
  StatusFilterType
} from "@app/modules/clients/entities/entities";

// Etiquetas en español para el filtro de estado (sin enum: mapa tipado).
export const STATUS_FILTER_LABELS: Record<StatusFilterType, string> = {
  all: "Todos los estados",
  active: "Activos",
  inactive: "Inactivos"
};

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
    saving: false
  } satisfies ClientsDataType
};
