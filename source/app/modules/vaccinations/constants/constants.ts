import type {
  VaccinationFormType,
  VaccinationsDataType,
  VaccineStatusType
} from "@app/modules/vaccinations/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const STATUS_LABELS: Record<VaccineStatusType, string> = {
  applied: "Aplicada",
  pending: "Pendiente",
  overdue: "Vencida"
};

// Tono del badge por estado (verde/azul/ámbar).
export const STATUS_TONES: Record<VaccineStatusType, "success" | "info" | "warning"> = {
  applied: "success",
  pending: "info",
  overdue: "warning"
};

// Formulario vacío (alta de vacunación).
export const EMPTY_FORM: VaccinationFormType = {
  patientId: "",
  vaccineName: "",
  date: "",
  nextDoseDate: "",
  batch: "",
  vetId: "",
  notes: ""
};

export const INITIAL_STATE = {
  VACCINATIONS_PAGE: {
    items: [],
    loading: true,
    query: "",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies VaccinationsDataType
};
