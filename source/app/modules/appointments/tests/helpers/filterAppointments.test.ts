import { filterAppointments } from "@app/modules/appointments/helpers/filterAppointments";
import { buildAppointment } from "@app/modules/appointments/tests/factories";
import { describe, expect, it } from "vitest";

const consult = buildAppointment({
  id: "1",
  type: "consultation",
  status: "scheduled",
  reason: "Control anual"
});
const surgery = buildAppointment({
  id: "2",
  type: "surgery",
  status: "confirmed",
  reason: "Castración"
});

describe("filterAppointments", () => {
  it("sin query ni filtros devuelve todos", () => {
    expect(filterAppointments([consult, surgery], "", "all", "all")).toHaveLength(2);
  });

  it("filtra por tipo", () => {
    expect(filterAppointments([consult, surgery], "", "surgery", "all")).toEqual([surgery]);
  });

  it("filtra por estado", () => {
    expect(filterAppointments([consult, surgery], "", "all", "scheduled")).toEqual([consult]);
  });

  it("busca por motivo (case-insensitive)", () => {
    expect(filterAppointments([consult, surgery], "castr", "all", "all")).toEqual([surgery]);
    expect(filterAppointments([consult, surgery], "CONTROL", "all", "all")).toEqual([consult]);
  });
});
