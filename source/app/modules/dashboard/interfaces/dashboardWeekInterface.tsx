import type { DashAppointmentType } from "@app/modules/dashboard/entities/entities";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import WeekCalendarInterface, {
  type WeekEventType
} from "@app/modules/main/interfaces/weekCalendarInterface";

type Props = {
  appointments: DashAppointmentType[];
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onOpenAgenda: () => void;
};

const time = (iso: string): string => (iso.length >= 16 ? iso.slice(11, 16) : "");

// Calendario semanal del panel: vista rápida de los turnos de la semana. Clic → abre la Agenda.
export default function DashboardWeekInterface({
  appointments,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
  onOpenAgenda
}: Props) {
  const { getLabel } = useEntityLookup("patients");

  const events: WeekEventType[] = appointments.map((appointment) => ({
    id: appointment.id,
    date: appointment.date,
    title: `${time(appointment.date)} · ${getLabel(appointment.patientId) || "—"}`,
    muted: appointment.status === "cancelled"
  }));

  return (
    <WeekCalendarInterface
      events={events}
      weekStart={weekStart}
      onPrevWeek={onPrevWeek}
      onNextWeek={onNextWeek}
      onToday={onToday}
      onSelectEvent={() => onOpenAgenda()}
      onSelectDay={() => onOpenAgenda()}
    />
  );
}
