import {
  METRIC_LABELS,
  METRIC_ORDER,
  METRIC_TONES
} from "@app/modules/reports/constants/constants";
import type {
  MetricKeyType,
  ReportMetricInputType,
  ReportMetricType,
  ReportsFormType
} from "@app/modules/reports/entities/entities";

// Función pura: arma la lista de métricas ordenada a partir de los conteos por clave.
// `counts` puede venir incompleto; las claves faltantes quedan en 0 (no rompe la vista).
export function buildMetrics(counts: Partial<Record<MetricKeyType, number>>): ReportMetricType[] {
  return METRIC_ORDER.map((key) => ({
    key: key,
    label: METRIC_LABELS[key],
    value: counts[key] ?? 0,
    tone: METRIC_TONES[key]
  }));
}

// Formulario → datos persistibles (forma Input de la plantilla; sin la clave calculada).
export function toMetricInput(form: ReportsFormType): ReportMetricInputType {
  return {
    label: form.label.trim(),
    value: 0,
    tone: form.tone
  };
}

// Métrica existente → formulario (para edición del reporte guardado).
export function formFromMetric(metric: ReportMetricType): ReportsFormType {
  return {
    label: metric.label,
    fromDate: "",
    toDate: "",
    tone: metric.tone,
    notes: ""
  };
}
