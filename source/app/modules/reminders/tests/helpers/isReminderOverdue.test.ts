import { isReminderOverdue } from "@app/modules/reminders/helpers/isReminderOverdue";
import { describe, expect, it } from "vitest";

// Fecha de referencia fija: 2026-07-01 (mediodía local para evitar bordes).
const now = new Date(2026, 6, 1, 12, 0, 0);

describe("isReminderOverdue", () => {
  it("es true cuando el vencimiento es anterior a hoy", () => {
    expect(isReminderOverdue("2026-06-30", now)).toBe(true);
    expect(isReminderOverdue("2025-01-01", now)).toBe(true);
  });

  it("es false cuando el vencimiento es hoy", () => {
    expect(isReminderOverdue("2026-07-01", now)).toBe(false);
  });

  it("es false cuando el vencimiento es futuro", () => {
    expect(isReminderOverdue("2026-07-02", now)).toBe(false);
    expect(isReminderOverdue("2027-01-01", now)).toBe(false);
  });

  it("es false ante una fecha vacía o mal formada", () => {
    expect(isReminderOverdue("", now)).toBe(false);
    expect(isReminderOverdue("2026-07", now)).toBe(false);
    expect(isReminderOverdue("no-es-fecha", now)).toBe(false);
  });
});
