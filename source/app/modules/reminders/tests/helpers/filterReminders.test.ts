import { filterReminders } from "@app/modules/reminders/helpers/filterReminders";
import { buildReminder } from "@app/modules/reminders/tests/factories";
import { describe, expect, it } from "vitest";

const vaccine = buildReminder({
  id: "1",
  type: "vaccine",
  status: "pending",
  message: "Vacuna antirrábica"
});
const control = buildReminder({
  id: "2",
  type: "control",
  status: "sent",
  message: "Control anual"
});

describe("filterReminders", () => {
  it("sin query ni filtros devuelve todos", () => {
    expect(filterReminders([vaccine, control], "", "all", "all")).toHaveLength(2);
  });

  it("filtra por tipo", () => {
    expect(filterReminders([vaccine, control], "", "control", "all")).toEqual([control]);
  });

  it("filtra por estado", () => {
    expect(filterReminders([vaccine, control], "", "all", "pending")).toEqual([vaccine]);
  });

  it("busca por mensaje (case-insensitive)", () => {
    expect(filterReminders([vaccine, control], "antirráBICA", "all", "all")).toEqual([vaccine]);
    expect(filterReminders([vaccine, control], "anual", "all", "all")).toEqual([control]);
  });
});
