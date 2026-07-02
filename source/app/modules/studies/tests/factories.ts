import { EMPTY_FORM } from "@app/modules/studies/constants/constants";
import type { StudyFormType, StudyType } from "@app/modules/studies/entities/entities";

// Factories de datos del módulo estudios para tests.

export function buildStudy(overrides: Partial<StudyType> = {}): StudyType {
  return {
    id: "stu-1",
    patientId: "pat-1",
    type: "lab",
    name: "Hemograma completo",
    date: "2026-05-10",
    requestedBy: "Dra. Pérez",
    result: "",
    status: "requested",
    attachments: [],
    ...overrides
  };
}

export function buildStudyForm(overrides: Partial<StudyFormType> = {}): StudyFormType {
  return {
    ...EMPTY_FORM,
    name: "Hemograma completo",
    patientId: "pat-1",
    ...overrides
  };
}
