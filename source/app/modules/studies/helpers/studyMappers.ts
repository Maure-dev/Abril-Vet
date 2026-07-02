import type { AttachmentType } from "@app/modules/main/entities/entities";
import type {
  StudyFormType,
  StudyInputType,
  StudyType
} from "@app/modules/studies/entities/entities";

// Formulario → datos persistibles. `base` aporta los campos que no están en el form
// (attachments), tomados del estudio existente en edición. En el alta van vacíos.
export function toStudyInput(
  form: StudyFormType,
  base: { attachments?: AttachmentType[] } = {}
): StudyInputType {
  return {
    patientId: form.patientId.trim(),
    type: form.type,
    name: form.name.trim(),
    date: form.date.trim().length > 0 ? form.date : null,
    requestedBy: form.requestedBy.trim(),
    result: form.result.trim(),
    status: form.status,
    attachments: base.attachments ?? []
  };
}

// Estudio existente → formulario (para edición).
export function formFromStudy(study: StudyType): StudyFormType {
  return {
    patientId: study.patientId,
    type: study.type,
    name: study.name,
    date: study.date ?? "",
    requestedBy: study.requestedBy,
    result: study.result,
    status: study.status
  };
}
