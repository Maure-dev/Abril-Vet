import { todayStr, weekDays } from "@app/modules/main/helpers/weekDates";
import ButtonInterface from "./buttonInterface";
import { Plus } from "./icons";

// Evento genérico del calendario. `date` es ISO (yyyy-mm-dd o yyyy-mm-ddThh:mm).
export type WeekEventType = {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  muted?: boolean;
};

type Props = {
  events: WeekEventType[];
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  // Si se pasan, cada evento / día es clickeable.
  onSelectEvent?: (id: string) => void;
  onSelectDay?: (dateStr: string) => void;
};

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const dayMonth = (dateStr: string): string => {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
};

// Calendario semanal (lunes a domingo): visualiza los eventos de cada día y los días libres.
export default function WeekCalendarInterface({
  events,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
  onSelectEvent,
  onSelectDay
}: Props) {
  const days = weekDays(weekStart);
  const today = todayStr();

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = events
            .filter((e) => e.date.slice(0, 10) === day)
            .sort((a, b) => a.date.localeCompare(b.date));
          const isToday = day === today;
          const headerClass = `flex items-center justify-between gap-1 rounded-t-card border-b border-line px-2 py-1.5 text-xs font-semibold ${
            isToday ? "bg-brand-tint text-brand-fg" : "text-ink-soft"
          }`;
          return (
            <div
              key={day}
              className={`flex min-h-[8rem] flex-col rounded-card border bg-surface ${
                isToday ? "border-brand" : "border-line"
              }`}
            >
              {onSelectDay ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(day)}
                  title={`Nuevo en ${dayMonth(day)}`}
                  className={`${headerClass} ${isToday ? "" : "hover:bg-surface-muted"}`}
                >
                  <span>
                    {DAY_NAMES[index]} {dayMonth(day)}
                  </span>
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </button>
              ) : (
                <div className={headerClass}>
                  <span>
                    {DAY_NAMES[index]} {dayMonth(day)}
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-1 p-2">
                {dayEvents.length === 0 ? (
                  <span className="text-xs text-ink-soft/60">Libre</span>
                ) : (
                  dayEvents.map((event) => {
                    const eventClass = `flex flex-col rounded-buttons border border-line px-2 py-1 text-left text-xs ${
                      event.muted ? "opacity-50 line-through" : ""
                    }`;
                    const body = (
                      <>
                        <span className="font-medium text-ink">{event.title}</span>
                        {event.subtitle ? (
                          <span className="text-ink-soft">{event.subtitle}</span>
                        ) : null}
                      </>
                    );
                    return onSelectEvent ? (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectEvent(event.id)}
                        className={`${eventClass} hover:bg-surface-muted`}
                      >
                        {body}
                      </button>
                    ) : (
                      <div key={event.id} className={eventClass}>
                        {body}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
