import type {
  DewormingFormType,
  DewormingStatusType,
  DewormingsDataType
} from "@app/modules/dewormings/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const STATUS_LABELS: Record<DewormingStatusType, string> = {
  applied: "Aplicada",
  pending: "Pendiente",
  overdue: "Vencida"
};

// Tono del badge por estado (verde/azul/ámbar).
export const STATUS_TONES: Record<DewormingStatusType, "success" | "info" | "warning"> = {
  applied: "success",
  pending: "info",
  overdue: "warning"
};

// Formulario vacío (alta de desparasitación).
export const EMPTY_FORM: DewormingFormType = {
  patientId: "",
  productName: "",
  date: "",
  nextDoseDate: "",
  weightKg: "",
  vetId: "",
  notes: ""
};

export const INITIAL_STATE = {
  DEWORMINGS_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies DewormingsDataType
};
