import type {
  InventoryDataType,
  MovementFormType,
  MovementTypeType
} from "@app/modules/inventory/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const MOVEMENT_TYPE_LABELS: Record<MovementTypeType, string> = {
  in: "Entrada",
  out: "Salida",
  adjustment: "Ajuste",
  transfer: "Transferencia"
};

// Formulario vacío (alta de movimiento).
export const EMPTY_FORM: MovementFormType = {
  productId: "",
  type: "in",
  quantity: "",
  reason: "",
  date: "",
  warehouse: "",
  notes: ""
};

export const INITIAL_STATE = {
  INVENTORY_PAGE: {
    items: [],
    loading: true,
    query: "",
    typeFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies InventoryDataType
};
