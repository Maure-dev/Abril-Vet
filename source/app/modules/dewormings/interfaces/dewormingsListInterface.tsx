import { STATUS_LABELS, STATUS_TONES } from "@app/modules/dewormings/constants/constants";
import type {
  DewormingStatusFilterType,
  DewormingStatusType,
  DewormingType
} from "@app/modules/dewormings/entities/entities";
import { computeDewormingStatus } from "@app/modules/dewormings/helpers/computeDewormingStatus";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { Bug, Pencil, Plus } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: DewormingType[];
  query: string;
  statusFilter: DewormingStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: DewormingStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (deworming: DewormingType) => void;
  onOpenEdit: (deworming: DewormingType) => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as DewormingStatusType[];

export default function DewormingsListInterface({
  items,
  query,
  statusFilter,
  onSearch,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por antiparasitario..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as DewormingStatusFilterType)}
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
            Nueva desparasitación
          </ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Bug}
          title="No hay desparasitaciones para mostrar"
          description="Registrá la primera desparasitación o ajustá la búsqueda y los filtros."
          action={
            <ButtonInterface onClick={onOpenCreate}>
              <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              Nueva desparasitación
            </ButtonInterface>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Antiparasitario</th>
                <th className="px-4 py-3 font-semibold">Aplicación</th>
                <th className="px-4 py-3 font-semibold">Próxima dosis</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((deworming) => {
                const status = computeDewormingStatus(deworming.nextDoseDate);
                return (
                  <tr
                    key={deworming.id}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                    onClick={() => onOpenDetail(deworming)}
                  >
                    <td className="px-4 py-3">
                      <EntityLinkInterface
                        kind="patients"
                        id={deworming.patientId}
                        label={getPatientLabel(deworming.patientId)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{deworming.productName}</td>
                    <td className="px-4 py-3 text-ink-soft">{deworming.date || "—"}</td>
                    <td className="px-4 py-3 text-ink-soft">{deworming.nextDoseDate || "—"}</td>
                    <td className="px-4 py-3">
                      <BadgeInterface tone={STATUS_TONES[status]}>
                        {STATUS_LABELS[status]}
                      </BadgeInterface>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Editar ${deworming.productName}`}
                        className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(deworming);
                        }}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
