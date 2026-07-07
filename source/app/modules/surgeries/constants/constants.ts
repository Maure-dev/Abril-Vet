import type {
  SurgeriesDataType,
  SurgeryFormType,
  SurgeryStatusType
} from "@app/modules/surgeries/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const SURGERY_STATUS_LABELS: Record<SurgeryStatusType, string> = {
  scheduled: "Programada",
  done: "Realizada",
  cancelled: "Cancelada"
};

// Formulario vacío (alta de cirugía).
export const EMPTY_FORM: SurgeryFormType = {
  patientId: "",
  date: "",
  type: "",
  vetId: "",
  assistants: "",
  diagnosis: "",
  medication: "",
  evolution: "",
  status: "scheduled",
  notes: "",
  attachments: []
};

export const INITIAL_STATE = {
  SURGERIES_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies SurgeriesDataType
};
