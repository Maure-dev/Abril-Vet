import type {
  StudyFormType,
  StudyInputType,
  StudyType
} from "@app/modules/studies/entities/entities";

// Formulario → datos persistibles. Los adjuntos viajan en el propio formulario
// (se suben con FileUploadInterface), así que se toman directamente de `form`.
export function toStudyInput(form: StudyFormType): StudyInputType {
  return {
    patientId: form.patientId.trim(),
    type: form.type,
    name: form.name.trim(),
    date: form.date.trim().length > 0 ? form.date : null,
    requestedBy: form.requestedBy.trim(),
    result: form.result.trim(),
    status: form.status,
    attachments: form.attachments
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
    status: study.status,
    attachments: study.attachments
  };
}
