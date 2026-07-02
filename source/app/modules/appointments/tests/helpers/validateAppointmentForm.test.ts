import { validateAppointmentForm } from "@app/modules/appointments/helpers/validateAppointmentForm";
import { buildAppointmentForm } from "@app/modules/appointments/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateAppointmentForm", () => {
  it("acepta un formulario válido", () => {
    const errors = validateAppointmentForm(buildAppointmentForm());
    expect(errors).toEqual({});
  });

  it("exige paciente y fecha", () => {
    const errors = validateAppointmentForm(buildAppointmentForm({ patientId: "", date: "" }));
    expect(errors.patientId).toBeDefined();
    expect(errors.date).toBeDefined();
  });

  it("rechaza una fecha inválida", () => {
    const errors = validateAppointmentForm(buildAppointmentForm({ date: "no-es-fecha" }));
    expect(errors.date).toBeDefined();
  });

  it("rechaza duración no numérica o <= 0", () => {
    expect(
      validateAppointmentForm(buildAppointmentForm({ durationMin: "abc" })).durationMin
    ).toBeDefined();
    expect(
      validateAppointmentForm(buildAppointmentForm({ durationMin: "0" })).durationMin
    ).toBeDefined();
    expect(
      validateAppointmentForm(buildAppointmentForm({ durationMin: "45" })).durationMin
    ).toBeUndefined();
  });
});
