import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, Plus, Syringe } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { STATUS_LABELS, STATUS_TONES } from "@app/modules/vaccinations/constants/constants";
import type {
  VaccinationType,
  VaccineStatusFilterType,
  VaccineStatusType
} from "@app/modules/vaccinations/entities/entities";
import { computeVaccineStatus } from "@app/modules/vaccinations/helpers/computeVaccineStatus";

type Props = {
  items: VaccinationType[];
  query: string;
  statusFilter: VaccineStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: VaccineStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (vaccination: VaccinationType) => void;
  onOpenEdit: (vaccination: VaccinationType) => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as VaccineStatusType[];

export default function VaccinationsListInterface({
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
          placeholder="Buscar por nombre de vacuna..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as VaccineStatusFilterType)}
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
            Nueva vacunación
          </ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Syringe}
          title="No hay vacunaciones para mostrar"
          description="Registrá la primera vacuna o ajustá la búsqueda y los filtros."
          action={
            <ButtonInterface onClick={onOpenCreate}>
              <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              Nueva vacunación
            </ButtonInterface>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Vacuna</th>
                <th className="px-4 py-3 font-semibold">Aplicación</th>
                <th className="px-4 py-3 font-semibold">Próxima dosis</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((vaccination) => {
                const status = computeVaccineStatus(vaccination.nextDoseDate);
                return (
                  <tr
                    key={vaccination.id}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                    onClick={() => onOpenDetail(vaccination)}
                  >
                    <td className="px-4 py-3 text-ink-soft">{vaccination.patientId || "—"}</td>
                    <td className="px-4 py-3 font-medium text-ink">{vaccination.vaccineName}</td>
                    <td className="px-4 py-3 text-ink-soft">{vaccination.date || "—"}</td>
                    <td className="px-4 py-3 text-ink-soft">{vaccination.nextDoseDate || "—"}</td>
                    <td className="px-4 py-3">
                      <BadgeInterface tone={STATUS_TONES[status]}>
                        {STATUS_LABELS[status]}
                      </BadgeInterface>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Editar ${vaccination.vaccineName}`}
                        className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(vaccination);
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
