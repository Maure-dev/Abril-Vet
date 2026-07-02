import type {
  HospitalizationFormType,
  HospitalizationStatusType,
  HospitalizationsDataType
} from "@app/modules/hospitalizations/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const STATUS_LABELS: Record<HospitalizationStatusType, string> = {
  active: "Internado",
  discharged: "Dado de alta"
};

// Formulario vacío (alta de internación).
export const EMPTY_FORM: HospitalizationFormType = {
  patientId: "",
  admissionDate: "",
  dischargeDate: "",
  status: "active",
  reason: "",
  dailyNotes: "",
  medication: "",
  feeding: "",
  controls: "",
  notes: ""
};

export const INITIAL_STATE = {
  HOSPITALIZATIONS_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies HospitalizationsDataType
};
