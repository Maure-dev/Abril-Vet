import { METRIC_LABELS } from "@app/modules/reports/constants/constants";
import type { MetricToneType, ReportMetricType } from "@app/modules/reports/entities/entities";

// Función pura: filtra métricas por texto (etiqueta o clave) y por tono. Case-insensitive.
export function filterMetrics(
  metrics: ReportMetricType[],
  query: string,
  toneFilter: MetricToneType | "all"
): ReportMetricType[] {
  const q = query.trim().toLowerCase();
  return metrics.filter((metric) => {
    if (toneFilter !== "all" && metric.tone !== toneFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [metric.label, metric.key, METRIC_LABELS[metric.key]].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
