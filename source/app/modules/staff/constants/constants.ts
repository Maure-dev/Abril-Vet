import type { StaffDataType, StaffFormType } from "@app/modules/staff/entities/entities";

// Etiquetas en español para el filtro de estado (sin enum: mapa tipado).
export const STATUS_FILTER_LABELS: Record<"all" | "active" | "inactive", string> = {
  all: "Todos los estados",
  active: "Activos",
  inactive: "Inactivos"
};

// Formulario vacío (alta de personal). El rol arranca en el mínimo privilegio (asistente).
export const EMPTY_FORM: StaffFormType = {
  firstName: "",
  lastName: "",
  email: "",
  roles: ["assistant"],
  phone: "",
  isActive: true,
  notes: "",
  password: ""
};

export const INITIAL_STATE = {
  STAFF_PAGE: {
    items: [],
    loading: true,
    query: "",
    roleFilter: "all",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies StaffDataType
};
