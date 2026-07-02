import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { METRIC_LABELS, TONE_LABELS } from "@app/modules/reports/constants/constants";
import type { ReportMetricType } from "@app/modules/reports/entities/entities";

type Props = {
  metric: ReportMetricType;
  onEdit: (metric: ReportMetricType) => void;
  onDelete: (metric: ReportMetricType) => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function ReportsDetailInterface({ metric, onEdit, onDelete, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{metric.label}</h2>
        <BadgeInterface tone={metric.tone}>{TONE_LABELS[metric.tone]}</BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(metric)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(metric)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Detalle de la métrica</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Métrica" value={METRIC_LABELS[metric.key]} />
          <Row label="Valor actual" value={String(metric.value)} />
          <Row label="Tono" value={TONE_LABELS[metric.tone]} />
        </dl>
      </CardInterface>
    </div>
  );
}
