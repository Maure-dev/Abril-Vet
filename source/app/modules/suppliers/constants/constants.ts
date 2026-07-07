import type {
  SupplierFormType,
  SupplierStatusFilterType,
  SuppliersDataType
} from "@app/modules/suppliers/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const STATUS_FILTER_LABELS: Record<SupplierStatusFilterType, string> = {
  all: "Todos los estados",
  active: "Activos",
  inactive: "Inactivos"
};

// Formulario vacío (alta de proveedor).
export const EMPTY_FORM: SupplierFormType = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  cuit: "",
  notes: "",
  isActive: true
};

export const INITIAL_STATE = {
  SUPPLIERS_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies SuppliersDataType
};
