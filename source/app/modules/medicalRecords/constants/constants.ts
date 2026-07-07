import type {
  MedicalRecordFormType,
  MedicalRecordsDataType
} from "@app/modules/medicalRecords/entities/entities";

// Etiquetas en español para las secciones clínicas de la ficha y el formulario.
export const SECTION_LABELS = {
  reason: "Motivo de consulta",
  anamnesis: "Anamnesis",
  physicalExam: "Examen físico",
  diagnosis: "Diagnóstico",
  treatment: "Tratamiento",
  prescription: "Prescripción",
  indications: "Indicaciones",
  evolution: "Evolución"
};

// Formulario vacío (alta de registro).
export const EMPTY_FORM: MedicalRecordFormType = {
  patientId: "",
  vetId: "",
  date: "",
  reason: "",
  anamnesis: "",
  physicalExam: "",
  diagnosis: "",
  treatment: "",
  prescription: "",
  indications: "",
  evolution: "",
  nextControlDate: "",
  attachments: []
};

export const INITIAL_STATE = {
  MEDICAL_RECORDS_PAGE: {
    items: [],
    loading: true,
    query: "",
    patientFilter: "",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies MedicalRecordsDataType
};
