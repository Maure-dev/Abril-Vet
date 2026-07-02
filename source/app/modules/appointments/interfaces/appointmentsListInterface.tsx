import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONE,
  APPOINTMENT_TYPE_LABELS
} from "@app/modules/appointments/constants/constants";
import type {
  AppointmentStatusFilterType,
  AppointmentStatusType,
  AppointmentType,
  AppointmentTypeFilterType,
  AppointmentTypeType
} from "@app/modules/appointments/entities/entities";
import { formatAppointmentDate } from "@app/modules/appointments/helpers/appointmentMappers";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Calendar, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: AppointmentType[];
  query: string;
  typeFilter: AppointmentTypeFilterType;
  statusFilter: AppointmentStatusFilterType;
  onSearch: (query: string) => void;
  onFilterType: (type: AppointmentTypeFilterType) => void;
  onFilterStatus: (status: AppointmentStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (appointment: AppointmentType) => void;
  onOpenEdit: (appointment: AppointmentType) => void;
};

const TYPE_OPTIONS = Object.keys(APPOINTMENT_TYPE_LABELS) as AppointmentTypeType[];
const STATUS_OPTIONS = Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatusType[];

export default function AppointmentsListInterface({
  items,
  query,
  typeFilter,
  statusFilter,
  onSearch,
  onFilterType,
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
          value={typeFilter}
          onChange={(e) => onFilterType(e.target.value as AppointmentTypeFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los tipos</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {APPOINTMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectInterface>
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as AppointmentStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {APPOINTMENT_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo turno</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Calendar}
          title="No hay turnos para mostrar"
          description="Cargá el primer turno o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo turno</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha/hora</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(appointment)}
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {formatAppointmentDate(appointment.date)}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone="brand">
                      {APPOINTMENT_TYPE_LABELS[appointment.type]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{appointment.patientId || "—"}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone={APPOINTMENT_STATUS_TONE[appointment.status]}>
                      {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar turno ${formatAppointmentDate(appointment.date)}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(appointment);
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
