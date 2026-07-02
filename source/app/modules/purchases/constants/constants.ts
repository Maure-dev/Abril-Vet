import type {
  PurchaseFormType,
  PurchaseItemFormType,
  PurchaseStatusType,
  PurchasesDataType
} from "@app/modules/purchases/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const STATUS_LABELS: Record<PurchaseStatusType, string> = {
  draft: "Borrador",
  ordered: "Pedida",
  received: "Recibida",
  cancelled: "Cancelada"
};

// Ítem vacío (fila nueva en el formulario).
export const EMPTY_ITEM: PurchaseItemFormType = {
  productId: "",
  quantity: "",
  unitCost: ""
};

// Formulario vacío (alta de orden de compra).
export const EMPTY_FORM: PurchaseFormType = {
  supplierId: "",
  date: "",
  status: "draft",
  invoiceNumber: "",
  notes: "",
  items: [{ ...EMPTY_ITEM }]
};

export const INITIAL_STATE = {
  PURCHASES_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies PurchasesDataType
};
