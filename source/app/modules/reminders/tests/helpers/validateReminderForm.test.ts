import { validateReminderForm } from "@app/modules/reminders/helpers/validateReminderForm";
import { buildReminderForm } from "@app/modules/reminders/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateReminderForm", () => {
  it("no devuelve errores con un formulario válido", () => {
    const errors = validateReminderForm(buildReminderForm());
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("exige la fecha de vencimiento", () => {
    const errors = validateReminderForm(buildReminderForm({ dueDate: "" }));
    expect(errors.dueDate).toBeDefined();
  });

  it("rechaza una fecha de vencimiento inválida", () => {
    const errors = validateReminderForm(buildReminderForm({ dueDate: "no-es-fecha" }));
    expect(errors.dueDate).toBeDefined();
  });

  it("exige un mensaje de al menos 3 caracteres", () => {
    expect(validateReminderForm(buildReminderForm({ message: "ok" })).message).toBeDefined();
    expect(validateReminderForm(buildReminderForm({ message: "   " })).message).toBeDefined();
  });
});
