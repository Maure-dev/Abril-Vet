import type {
  StudiesDataType,
  StudyFormType,
  StudyStatusType,
  StudyTypeType
} from "@app/modules/studies/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const STUDY_TYPE_LABELS: Record<StudyTypeType, string> = {
  lab: "Laboratorio",
  ultrasound: "Ecografía",
  xray: "Radiografía",
  mri: "Resonancia",
  echocardiogram: "Ecocardiograma",
  other: "Otro"
};

export const STUDY_STATUS_LABELS: Record<StudyStatusType, string> = {
  requested: "Solicitado",
  in_progress: "En proceso",
  completed: "Completado"
};

// Formulario vacío (alta de estudio).
export const EMPTY_FORM: StudyFormType = {
  patientId: "",
  type: "lab",
  name: "",
  date: "",
  requestedBy: "",
  result: "",
  status: "requested",
  attachments: []
};

export const INITIAL_STATE = {
  STUDIES_PAGE: {
    items: [],
    loading: true,
    query: "",
    typeFilter: "all",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies StudiesDataType
};
