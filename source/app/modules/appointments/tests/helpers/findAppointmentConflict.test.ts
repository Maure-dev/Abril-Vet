import { findAppointmentConflict } from "@app/modules/appointments/helpers/findAppointmentConflict";
import { describe, expect, it } from "vitest";

type Item = { id: string; vetId: string; date: string; durationMin: number; status: string };
const item = (overrides: Partial<Item> = {}): Item => ({
  id: "a",
  vetId: "v1",
  date: "2026-07-02T10:00",
  durationMin: 30,
  status: "scheduled",
  ...overrides
});

describe("findAppointmentConflict", () => {
  it("sin veterinario o sin fecha no hay conflicto", () => {
    expect(
      findAppointmentConflict(
        { vetId: "", date: "2026-07-02T10:00", durationMin: "30" },
        [item()],
        ""
      )
    ).toBeNull();
    expect(
      findAppointmentConflict({ vetId: "v1", date: "", durationMin: "30" }, [item()], "")
    ).toBeNull();
  });

  it("detecta solapamiento con el mismo veterinario", () => {
    const conflict = findAppointmentConflict(
      { vetId: "v1", date: "2026-07-02T10:15", durationMin: "30" },
      [item({ id: "x" })],
      ""
    );
    expect(conflict?.id).toBe("x");
  });

  it("mismo horario exacto es conflicto", () => {
    const conflict = findAppointmentConflict(
      { vetId: "v1", date: "2026-07-02T10:00", durationMin: "30" },
      [item({ id: "x" })],
      ""
    );
    expect(conflict?.id).toBe("x");
  });

  it("otro veterinario o sin solapamiento no es conflicto", () => {
    expect(
      findAppointmentConflict(
        { vetId: "v2", date: "2026-07-02T10:00", durationMin: "30" },
        [item({ vetId: "v1" })],
        ""
      )
    ).toBeNull();
    expect(
      findAppointmentConflict(
        { vetId: "v1", date: "2026-07-02T11:00", durationMin: "30" },
        [item({ date: "2026-07-02T10:00" })],
        ""
      )
    ).toBeNull();
  });

  it("ignora el turno en edición (excludeId) y los cancelados", () => {
    expect(
      findAppointmentConflict(
        { vetId: "v1", date: "2026-07-02T10:00", durationMin: "30" },
        [item({ id: "self" })],
        "self"
      )
    ).toBeNull();
    expect(
      findAppointmentConflict(
        { vetId: "v1", date: "2026-07-02T10:00", durationMin: "30" },
        [item({ id: "c", status: "cancelled" })],
        ""
      )
    ).toBeNull();
  });
});
