import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { Pencil, Scissors } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import StatusSelectInterface from "@app/modules/main/interfaces/statusSelectInterface";
import { SURGERY_STATUS_LABELS } from "@app/modules/surgeries/constants/constants";
import type {
  SurgeryStatusFilterType,
  SurgeryStatusType,
  SurgeryType
} from "@app/modules/surgeries/entities/entities";

type Props = {
  items: SurgeryType[];
  query: string;
  statusFilter: SurgeryStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: SurgeryStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (surgery: SurgeryType) => void;
  onOpenEdit: (surgery: SurgeryType) => void;
  onQuickStatus: (surgery: SurgeryType, status: SurgeryStatusType) => void;
};

const STATUS_OPTIONS = Object.keys(SURGERY_STATUS_LABELS) as SurgeryStatusType[];
const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map((status) => ({
  value: status,
  label: SURGERY_STATUS_LABELS[status]
}));

export default function SurgeriesListInterface({
  items,
  query,
  statusFilter,
  onSearch,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit,
  onQuickStatus
}: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por tipo de cirugía..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as SurgeryStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {SURGERY_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nueva cirugía</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Scissors}
          title="No hay cirugías para mostrar"
          description="Cargá la primera cirugía o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nueva cirugía</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((surgery) => (
                <tr
                  key={surgery.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(surgery)}
                >
                  <td className="px-4 py-3 text-ink-soft">{surgery.date || "—"}</td>
                  <td className="px-4 py-3 font-medium text-ink">{surgery.type || "—"}</td>
                  <td className="px-4 py-3">
                    <EntityLinkInterface
                      kind="patients"
                      id={surgery.patientId}
                      label={getPatientLabel(surgery.patientId)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelectInterface
                      value={surgery.status}
                      options={STATUS_SELECT_OPTIONS}
                      onChange={(value) => onQuickStatus(surgery, value as SurgeryStatusType)}
                      ariaLabel={`Cambiar estado de la cirugía ${surgery.type}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar cirugía ${surgery.type}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(surgery);
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
