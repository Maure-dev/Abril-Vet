import CardInterface from "@app/modules/main/interfaces/cardInterface";
import IconInterface from "@app/modules/main/interfaces/iconInterface";
import type { LucideIcon } from "@app/modules/main/interfaces/icons";
import { CalendarDays, Coins, PawPrint, Users } from "@app/modules/main/interfaces/icons";
import type { MetricKeyType, ReportMetricType } from "@app/modules/reports/entities/entities";

type Props = {
  metrics: ReportMetricType[];
  onOpenDetail: (metric: ReportMetricType) => void;
};

// Ícono por métrica (nombres de lucide verificados).
const METRIC_ICONS: Record<MetricKeyType, LucideIcon> = {
  clients: Users,
  patients: PawPrint,
  appointments: CalendarDays,
  sales: Coins
};

// Clases del acento por tono (fondo tenue + color del ícono), usando los tonos de marca.
const TONE_ACCENT: Record<ReportMetricType["tone"], string> = {
  brand: "bg-brand-tint text-brand-fg",
  info: "bg-info-tint text-info",
  gold: "bg-gold/25 text-gold-fg",
  success: "bg-success-tint text-success"
};

// Tarjetas de KPI (una por métrica). Al hacer clic abren la ficha de la métrica.
export default function ReportsKpisInterface({ metrics, onOpenDetail }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <CardInterface
          key={metric.key}
          role="button"
          tabIndex={0}
          onClick={() => onOpenDetail(metric)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenDetail(metric);
            }
          }}
          className="cursor-pointer transition-shadow hover:shadow-soft"
        >
          <div className="flex items-center gap-4">
            <span
              className={`grid h-11 w-11 place-items-center rounded-buttons ${TONE_ACCENT[metric.tone]}`}
            >
              <IconInterface icon={METRIC_ICONS[metric.key]} size="md" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-2xl text-ink">{metric.value}</span>
              <span className="text-xs text-ink-soft">{metric.label}</span>
            </div>
          </div>
        </CardInterface>
      ))}
    </div>
  );
}
