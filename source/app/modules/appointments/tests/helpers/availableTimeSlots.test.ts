import { availableTimeSlots } from "@app/modules/appointments/helpers/availableTimeSlots";
import { buildAppointment } from "@app/modules/appointments/tests/factories";
import { describe, expect, it } from "vitest";

// Una fecha futura respecto de `now`, para que no actúe el filtro de "pasado".
const FUTURE_DATE = "2026-07-10";
const NOW = new Date(2026, 6, 7, 10, 0); // 2026-07-07 10:00 (local)

describe("availableTimeSlots", () => {
  it("devuelve [] si falta fecha o duración", () => {
    const base = { items: [], excludeId: "", now: NOW };
    expect(availableTimeSlots({ ...base, date: "", durationMin: 30, vetId: "vet-1" })).toEqual([]);
    expect(
      availableTimeSlots({ ...base, date: FUTURE_DATE, durationMin: 0, vetId: "vet-1" })
    ).toEqual([]);
  });

  it("sin veterinario ofrece todos los horarios sin chequear solapamientos", () => {
    const slots = availableTimeSlots({
      date: FUTURE_DATE,
      durationMin: 30,
      vetId: "",
      // Aunque haya un turno de otro veterinario a esa hora, sin veterinario no se descarta nada.
      items: [buildAppointment({ id: "a", date: `${FUTURE_DATE}T09:30`, vetId: "vet-1" })],
      excludeId: "",
      now: NOW
    });
    expect(slots[0]).toBe("08:00");
    expect(slots).toContain("09:30");
    expect(slots[slots.length - 1]).toBe("19:30");
  });

  it("genera slots dentro del horario de atención donde entre la duración completa", () => {
    const slots = availableTimeSlots({
      date: FUTURE_DATE,
      durationMin: 30,
      vetId: "vet-1",
      items: [],
      excludeId: "",
      now: NOW
    });
    expect(slots[0]).toBe("08:00");
    expect(slots[slots.length - 1]).toBe("19:30"); // 19:30 + 30 = 20:00 (cierre)
  });

  it("excluye los horarios que se pisan con otro turno del mismo veterinario", () => {
    const slots = availableTimeSlots({
      date: FUTURE_DATE,
      durationMin: 30,
      vetId: "vet-1",
      items: [buildAppointment({ id: "a", date: `${FUTURE_DATE}T09:30`, durationMin: 30 })],
      excludeId: "",
      now: NOW
    });
    expect(slots).toContain("09:00");
    expect(slots).toContain("10:00");
    expect(slots).not.toContain("09:15");
    expect(slots).not.toContain("09:30");
    expect(slots).not.toContain("09:45");
  });

  it("ignora turnos cancelados, de otros veterinarios y el propio (excludeId)", () => {
    const cancelled = availableTimeSlots({
      date: FUTURE_DATE,
      durationMin: 30,
      vetId: "vet-1",
      items: [
        buildAppointment({ id: "a", date: `${FUTURE_DATE}T09:30`, status: "cancelled" }),
        buildAppointment({ id: "b", date: `${FUTURE_DATE}T09:30`, vetId: "vet-2" })
      ],
      excludeId: "",
      now: NOW
    });
    expect(cancelled).toContain("09:30");

    const own = availableTimeSlots({
      date: FUTURE_DATE,
      durationMin: 30,
      vetId: "vet-1",
      items: [buildAppointment({ id: "self", date: `${FUTURE_DATE}T09:30` })],
      excludeId: "self",
      now: NOW
    });
    expect(own).toContain("09:30");
  });

  it("no ofrece horarios pasados si la fecha es hoy", () => {
    const slots = availableTimeSlots({
      date: "2026-07-07", // = hoy respecto de NOW
      durationMin: 30,
      vetId: "vet-1",
      items: [],
      excludeId: "",
      now: NOW
    });
    expect(slots[0]).toBe("10:00"); // NOW = 10:00, no hay slots antes
    expect(slots).not.toContain("09:45");
  });
});
