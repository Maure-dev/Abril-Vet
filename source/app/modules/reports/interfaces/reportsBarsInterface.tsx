import CardInterface from "@app/modules/main/interfaces/cardInterface";
import type { ReportMetricType } from "@app/modules/reports/entities/entities";
import { toBarPercents } from "@app/modules/reports/helpers/toBarPercents";

type Props = {
  metrics: ReportMetricType[];
};

// Color de relleno de la barra por tono (colores de marca del design system).
const TONE_FILL: Record<ReportMetricType["tone"], string> = {
  brand: "bg-brand",
  info: "bg-info",
  gold: "bg-gold",
  success: "bg-success"
};

// Gráfico de barras simple con CSS: cada barra es un div con `width` en % relativo al máximo.
// Sin librería de gráficos.
export default function ReportsBarsInterface({ metrics }: Props) {
  const percents = toBarPercents(metrics.map((metric) => metric.value));

  return (
    <CardInterface>
      <h3 className="mb-4 font-display text-base text-brand-fg">Comparativa</h3>
      <ul className="flex flex-col gap-3">
        {metrics.map((metric, index) => (
          <li key={metric.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-ink-soft">
              <span>{metric.label}</span>
              <span className="tabular-nums text-ink">{metric.value}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${TONE_FILL[metric.tone]}`}
                style={{ width: `${percents[index]}%` }}
                role="presentation"
              />
            </div>
          </li>
        ))}
      </ul>
    </CardInterface>
  );
}
