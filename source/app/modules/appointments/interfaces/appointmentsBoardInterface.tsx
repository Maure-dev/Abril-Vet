import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS
} from "@app/modules/appointments/constants/constants";
import type {
  AppointmentStatusType,
  AppointmentType
} from "@app/modules/appointments/entities/entities";
import { formatAppointmentDate } from "@app/modules/appointments/helpers/appointmentMappers";
import { weekDays } from "@app/modules/main/helpers/weekDates";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BoardInterface from "@app/modules/main/interfaces/boardInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";

const COLUMNS = (Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatusType[]).map((key) => ({
  key: key,
  label: APPOINTMENT_STATUS_LABELS[key]
}));

const dayMonth = (dateStr: string): string => {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
};

type Props = {
  items: AppointmentType[];
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onMoveStatus: (id: string, status: AppointmentStatusType) => void;
  onOpenDetail: (appointment: AppointmentType) => void;
};

// Tablero de turnos por estado, acotado a la semana visible: arrastrás la tarjeta de una columna
// a otra para cambiar el estado. La navegación semanal es la misma que el calendario.
export default function AppointmentsBoardInterface({
  items,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
  onMoveStatus,
  onOpenDetail
}: Props) {
  const { getLabel } = useEntityLookup("patients");
  const days = weekDays(weekStart);
  const weekItems = items.filter((appointment) => {
    const day = appointment.date.slice(0, 10);
    return day >= days[0] && day <= days[6];
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <ButtonInterface variant="secondary" size="sm" onClick={onPrevWeek}>
          ← Anterior
        </ButtonInterface>
        <ButtonInterface variant="ghost" size="sm" onClick={onToday}>
          Hoy
        </ButtonInterface>
        <ButtonInterface variant="secondary" size="sm" onClick={onNextWeek}>
          Siguiente →
        </ButtonInterface>
        <span className="text-sm text-ink-soft">
          Semana del {dayMonth(days[0])} al {dayMonth(days[6])}
        </span>
      </div>

      <BoardInterface
        columns={COLUMNS}
        items={weekItems}
        getId={(appointment) => appointment.id}
        getColumn={(appointment) => appointment.status}
        onMove={(id, columnKey) => onMoveStatus(id, columnKey as AppointmentStatusType)}
        emptyLabel="Sin turnos"
        renderCard={(appointment) => (
          <button
            type="button"
            onClick={() => onOpenDetail(appointment)}
            className="flex w-full flex-col gap-0.5 text-left"
          >
            <span className="text-sm font-medium text-ink">
              {formatAppointmentDate(appointment.date)}
            </span>
            <span className="text-xs text-ink-soft">{getLabel(appointment.patientId) || "—"}</span>
            <span className="text-xs text-brand-fg">
              {APPOINTMENT_TYPE_LABELS[appointment.type]}
            </span>
          </button>
        )}
      />
    </div>
  );
}
