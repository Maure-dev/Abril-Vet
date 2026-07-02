import { validateStudiesForm } from "@app/modules/studies/helpers/validateStudiesForm";
import { buildStudyForm } from "@app/modules/studies/tests/factories";
import { describe, expect, it } from "vitest";

describe("validateStudiesForm", () => {
  it("un formulario válido no tiene errores", () => {
    const errors = validateStudiesForm(buildStudyForm({ date: "2026-05-10" }));
    expect(errors).toEqual({});
  });

  it("exige paciente y nombre mínimo", () => {
    const errors = validateStudiesForm(buildStudyForm({ patientId: "", name: "a" }));
    expect(errors.patientId).toBeDefined();
    expect(errors.name).toBeDefined();
  });

  it("acepta fecha vacía", () => {
    const errors = validateStudiesForm(buildStudyForm({ date: "" }));
    expect(errors.date).toBeUndefined();
  });

  it("rechaza una fecha inválida", () => {
    expect(validateStudiesForm(buildStudyForm({ date: "2026-13-40" })).date).toBeDefined();
    expect(validateStudiesForm(buildStudyForm({ date: "no-es-fecha" })).date).toBeDefined();
  });
});
