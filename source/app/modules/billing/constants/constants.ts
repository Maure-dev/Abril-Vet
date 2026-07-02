import type {
  BillingDataType,
  BillingFormType,
  InvoiceItemFormType,
  InvoiceStatusType,
  PaymentMethodType
} from "@app/modules/billing/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  mixed: "Mixto"
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatusType, string> = {
  paid: "Pagada",
  partial: "Parcial",
  pending: "Pendiente"
};

// Fila de ítem vacía (para agregar renglones al formulario).
export const EMPTY_ITEM: InvoiceItemFormType = {
  description: "",
  quantity: "1",
  unitPrice: "0"
};

// Formulario vacío (alta de factura). Arranca con una fila de ítem.
export const EMPTY_FORM: BillingFormType = {
  clientId: "",
  date: "",
  items: [{ ...EMPTY_ITEM }],
  discount: "0",
  paymentMethod: "cash",
  status: "pending",
  paidAmount: "0",
  notes: ""
};

export const INITIAL_STATE = {
  BILLING_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies BillingDataType
};
