import type {
  PaymentMethodType,
  SaleFormType,
  SaleItemDraftType,
  SaleItemKindType,
  SalesDataType
} from "@app/modules/sales/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const ITEM_KIND_LABELS: Record<SaleItemKindType, string> = {
  product: "Producto",
  service: "Servicio"
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  mixed: "Mixto"
};

// Borrador vacío de una línea del carrito.
export const EMPTY_DRAFT: SaleItemDraftType = {
  kind: "product",
  refId: "",
  name: "",
  quantity: "1",
  unitPrice: ""
};

// Formulario vacío (nueva venta).
export const EMPTY_FORM: SaleFormType = {
  clientId: "",
  date: "",
  paymentMethod: "cash",
  discount: "",
  items: [],
  draft: EMPTY_DRAFT
};

export const INITIAL_STATE = {
  SALES_PAGE: {
    items: [],
    loading: true,
    query: "",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies SalesDataType
};
