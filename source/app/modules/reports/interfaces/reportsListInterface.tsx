import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { BarChart3, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { TONE_LABELS } from "@app/modules/reports/constants/constants";
import type { MetricToneType, ReportMetricType } from "@app/modules/reports/entities/entities";

type ToneFilterType = MetricToneType | "all";

type Props = {
  metrics: ReportMetricType[];
  query: string;
  toneFilter: ToneFilterType;
  onSearch: (query: string) => void;
  onFilterTone: (tone: ToneFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (metric: ReportMetricType) => void;
  onOpenEdit: (metric: ReportMetricType) => void;
};

const TONE_OPTIONS = Object.keys(TONE_LABELS) as MetricToneType[];

export default function ReportsListInterface({
  metrics,
  query,
  toneFilter,
  onSearch,
  onFilterTone,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar métrica por nombre..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={toneFilter}
          onChange={(e) => onFilterTone(e.target.value as ToneFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los tonos</option>
          {TONE_OPTIONS.map((tone) => (
            <option key={tone} value={tone}>
              {TONE_LABELS[tone]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo reporte</ButtonInterface>
        </div>
      </div>

      {metrics.length === 0 ? (
        <EmptyStateInterface
          icon={BarChart3}
          title="No hay métricas para mostrar"
          description="Ajustá la búsqueda y los filtros, o creá un reporte guardado."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo reporte</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Métrica</th>
                <th className="px-4 py-3 font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Tono</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr
                  key={metric.key}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(metric)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{metric.label}</td>
                  <td className="px-4 py-3 tabular-nums text-ink">{metric.value}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone={metric.tone}>{TONE_LABELS[metric.tone]}</BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${metric.label}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(metric);
                      }}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
