import { STATUS_LABELS } from "@app/modules/hospitalizations/constants/constants";
import type {
  HospitalizationStatusFilterType,
  HospitalizationStatusType,
  HospitalizationType
} from "@app/modules/hospitalizations/entities/entities";
import { computeStayDays } from "@app/modules/hospitalizations/helpers/computeStayDays";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Bed, Pencil, Plus } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: HospitalizationType[];
  query: string;
  statusFilter: HospitalizationStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: HospitalizationStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (hospitalization: HospitalizationType) => void;
  onOpenEdit: (hospitalization: HospitalizationType) => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as HospitalizationStatusType[];

export default function HospitalizationsListInterface({
  items,
  query,
  statusFilter,
  onSearch,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por motivo..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as HospitalizationStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>
            <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            Nueva internación
          </ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Bed}
          title="No hay internaciones para mostrar"
          description="Cargá la primera internación o ajustá la búsqueda y los filtros."
          action={
            <ButtonInterface onClick={onOpenCreate}>
              <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              Nueva internación
            </ButtonInterface>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Ingreso</th>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Motivo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Días</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((hospitalization) => (
                <tr
                  key={hospitalization.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(hospitalization)}
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {hospitalization.admissionDate || "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{hospitalization.patientId || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{hospitalization.reason || "—"}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone={hospitalization.status === "active" ? "info" : "success"}>
                      {STATUS_LABELS[hospitalization.status]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {computeStayDays(hospitalization.admissionDate, hospitalization.dischargeDate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar internación de ${hospitalization.patientId}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(hospitalization);
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
