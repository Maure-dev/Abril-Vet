import { APPOINTMENT_TYPE_LABELS } from "@app/modules/appointments/constants/constants";
import type { AppointmentType } from "@app/modules/appointments/entities/entities";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import WeekCalendarInterface, {
  type WeekEventType
} from "@app/modules/main/interfaces/weekCalendarInterface";

type Props = {
  items: AppointmentType[];
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onOpenDetail: (appointment: AppointmentType) => void;
  onOpenCreateOnDate: (dateStr: string) => void;
};

const time = (iso: string): string => (iso.length >= 16 ? iso.slice(11, 16) : "");

// Agenda semanal: mapea los turnos al calendario compartido. Clic en un turno abre su ficha;
// clic en el día abre el alta de turno en esa fecha.
export default function AppointmentsWeekInterface({
  items,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
  onOpenDetail,
  onOpenCreateOnDate
}: Props) {
  const { getLabel } = useEntityLookup("patients");

  const events: WeekEventType[] = items.map((appointment) => ({
    id: appointment.id,
    date: appointment.date,
    title: `${time(appointment.date)} · ${getLabel(appointment.patientId) || "—"}`,
    subtitle: APPOINTMENT_TYPE_LABELS[appointment.type],
    muted: appointment.status === "cancelled"
  }));

  const handleSelectEvent = (id: string): void => {
    const appointment = items.find((a) => a.id === id);
    if (appointment) {
      onOpenDetail(appointment);
    }
  };

  return (
    <WeekCalendarInterface
      events={events}
      weekStart={weekStart}
      onPrevWeek={onPrevWeek}
      onNextWeek={onNextWeek}
      onToday={onToday}
      onSelectEvent={handleSelectEvent}
      onSelectDay={onOpenCreateOnDate}
    />
  );
}
