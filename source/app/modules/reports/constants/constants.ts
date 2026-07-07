import type {
  MetricKeyType,
  MetricToneType,
  ReportsDataType,
  ReportsFormType
} from "@app/modules/reports/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const METRIC_LABELS: Record<MetricKeyType, string> = {
  clients: "Clientes",
  patients: "Pacientes",
  appointments: "Turnos",
  sales: "Ventas"
};

// Tono visual por métrica (colores de marca del design system).
export const METRIC_TONES: Record<MetricKeyType, MetricToneType> = {
  clients: "brand",
  patients: "info",
  appointments: "gold",
  sales: "success"
};

// Etiquetas de los tonos para el filtro y el formulario.
export const TONE_LABELS: Record<MetricToneType, string> = {
  brand: "Marca",
  info: "Información",
  gold: "Destacado",
  success: "Éxito"
};

// Nombres de las colecciones de Firestore que el service cuenta (por nombre, sin importar módulos).
export const METRIC_COLLECTIONS: Record<MetricKeyType, string> = {
  clients: "clients",
  patients: "patients",
  appointments: "appointments",
  sales: "sales"
};

// Orden fijo en el que se muestran las métricas.
export const METRIC_ORDER: MetricKeyType[] = ["clients", "patients", "appointments", "sales"];

// Formulario vacío (acotar el rango de lectura del reporte).
export const EMPTY_FORM: ReportsFormType = {
  label: "",
  fromDate: "",
  toDate: "",
  tone: "brand",
  notes: ""
};

export const INITIAL_STATE = {
  REPORTS_PAGE: {
    loading: true,
    metrics: [],
    sales: [],
    query: "",
    toneFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies ReportsDataType
};
