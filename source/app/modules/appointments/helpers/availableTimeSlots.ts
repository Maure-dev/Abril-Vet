import {
  CLINIC_CLOSE_MINUTES,
  CLINIC_OPEN_MINUTES,
  SLOT_STEP_MIN
} from "@app/modules/appointments/constants/constants";
import type { AppointmentType } from "@app/modules/appointments/entities/entities";

type Args = {
  date: string; // yyyy-mm-dd
  durationMin: number;
  vetId: string; // opcional: "" = turno sin veterinario asignado
  items: AppointmentType[];
  excludeId: string; // turno que se está editando (no pisa consigo mismo)
  now: Date; // referencia para descartar horarios pasados (se inyecta para poder testear)
};

const pad = (value: number): string => String(value).padStart(2, "0");

// hh:mm → minutos desde la medianoche.
function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

// Minutos desde la medianoche → hh:mm.
function minutesToTime(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

// yyyy-mm-dd local de una fecha.
function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Devuelve los horarios (hh:mm) disponibles para un turno: dentro del horario de atención, que
// entren completos antes del cierre, que no se pisen con otros turnos del mismo veterinario y que
// no queden en el pasado (si la fecha es hoy). Devuelve [] si falta fecha o duración. El
// veterinario es opcional: sin veterinario no hay agenda contra la cual chequear solapamientos.
export function availableTimeSlots({
  date,
  durationMin,
  vetId,
  items,
  excludeId,
  now
}: Args): string[] {
  if (!date || !durationMin || durationMin <= 0) {
    return [];
  }

  // Intervalos ocupados del veterinario ese día (en minutos desde la medianoche). Sin veterinario
  // asignado no se controla superposición (no se puede saber contra qué agenda chequear).
  const busy = vetId
    ? items
        .filter(
          (item) =>
            item.id !== excludeId &&
            item.vetId === vetId &&
            item.status !== "cancelled" &&
            item.date.slice(0, 10) === date &&
            item.date.length >= 16
        )
        .map((item) => {
          const start = timeToMinutes(item.date.slice(11, 16));
          return { start: start, end: start + item.durationMin };
        })
    : [];

  // Si la fecha elegida es hoy, no ofrecer horarios ya pasados.
  const minStart =
    date === toDateStr(now) ? now.getHours() * 60 + now.getMinutes() : Number.NEGATIVE_INFINITY;

  const slots: string[] = [];
  for (
    let start = CLINIC_OPEN_MINUTES;
    start + durationMin <= CLINIC_CLOSE_MINUTES;
    start += SLOT_STEP_MIN
  ) {
    if (start < minStart) {
      continue;
    }
    const end = start + durationMin;
    const overlaps = busy.some((interval) => start < interval.end && interval.start < end);
    if (!overlaps) {
      slots.push(minutesToTime(start));
    }
  }
  return slots;
}
