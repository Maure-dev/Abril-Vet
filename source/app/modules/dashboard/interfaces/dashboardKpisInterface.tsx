import type { DashboardKpiType, KpiToneType } from "@app/modules/dashboard/entities/entities";
import IconInterface from "@app/modules/main/interfaces/iconInterface";

type Props = {
  kpis: DashboardKpiType[];
};

const TONE: Record<KpiToneType, string> = {
  brand: "bg-brand-tint text-brand-fg",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  info: "bg-info-tint text-info",
  gold: "bg-gold/25 text-gold-fg",
  neutral: "bg-surface-muted text-ink-soft"
};

// Grilla de indicadores principales del panel.
export default function DashboardKpisInterface({ kpis }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.key}
          className="flex items-center gap-4 rounded-card border border-line bg-surface p-4 shadow-card"
        >
          <span className={`grid h-11 w-11 place-items-center rounded-buttons ${TONE[kpi.tone]}`}>
            <IconInterface icon={kpi.icon} size="md" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-2xl text-ink">{kpi.value}</span>
            <span className="text-xs text-ink-soft">{kpi.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
