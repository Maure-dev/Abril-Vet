import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { FlaskConical, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import StatusSelectInterface from "@app/modules/main/interfaces/statusSelectInterface";
import { STUDY_STATUS_LABELS, STUDY_TYPE_LABELS } from "@app/modules/studies/constants/constants";
import type {
  StudyStatusFilterType,
  StudyStatusType,
  StudyType,
  StudyTypeFilterType,
  StudyTypeType
} from "@app/modules/studies/entities/entities";

type Props = {
  items: StudyType[];
  query: string;
  typeFilter: StudyTypeFilterType;
  statusFilter: StudyStatusFilterType;
  onSearch: (query: string) => void;
  onFilterType: (typeFilter: StudyTypeFilterType) => void;
  onFilterStatus: (statusFilter: StudyStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (study: StudyType) => void;
  onOpenEdit: (study: StudyType) => void;
  onQuickStatus: (study: StudyType, status: StudyStatusType) => void;
};

const TYPE_OPTIONS = Object.keys(STUDY_TYPE_LABELS) as StudyTypeType[];
const STATUS_OPTIONS = Object.keys(STUDY_STATUS_LABELS) as StudyStatusType[];
const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map((status) => ({
  value: status,
  label: STUDY_STATUS_LABELS[status]
}));

export default function StudiesListInterface({
  items,
  query,
  typeFilter,
  statusFilter,
  onSearch,
  onFilterType,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit,
  onQuickStatus
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por nombre del estudio..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={typeFilter}
          onChange={(e) => onFilterType(e.target.value as StudyTypeFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los tipos</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {STUDY_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectInterface>
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as StudyStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STUDY_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo estudio</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={FlaskConical}
          title="No hay estudios para mostrar"
          description="Cargá el primer estudio o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo estudio</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((study) => (
                <tr
                  key={study.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(study)}
                >
                  <td className="px-4 py-3 text-ink-soft">{study.date || "—"}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone="brand">{STUDY_TYPE_LABELS[study.type]}</BadgeInterface>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{study.name}</td>
                  <td className="px-4 py-3">
                    <StatusSelectInterface
                      value={study.status}
                      options={STATUS_SELECT_OPTIONS}
                      onChange={(value) => onQuickStatus(study, value as StudyStatusType)}
                      ariaLabel={`Cambiar estado de ${study.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${study.name}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(study);
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
