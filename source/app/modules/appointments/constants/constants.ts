import type {
  AppointmentFormType,
  AppointmentStatusType,
  AppointmentsDataType,
  AppointmentTypeType
} from "@app/modules/appointments/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const APPOINTMENT_TYPE_LABELS: Record<AppointmentTypeType, string> = {
  consultation: "Consulta",
  surgery: "Cirugía",
  vaccination: "Vacunación",
  grooming: "Peluquería",
  bath: "Baño",
  other: "Otro"
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatusType, string> = {
  scheduled: "Programado",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  done: "Realizado"
};

// Tono de la pastilla (badge) según el estado del turno.
export const APPOINTMENT_STATUS_TONE: Record<
  AppointmentStatusType,
  "neutral" | "info" | "success" | "error"
> = {
  scheduled: "info",
  confirmed: "success",
  cancelled: "error",
  done: "neutral"
};

// Duración por defecto (minutos) de un turno nuevo.
export const DEFAULT_DURATION_MIN = "30";

// Formulario vacío (alta de turno).
export const EMPTY_FORM: AppointmentFormType = {
  patientId: "",
  clientId: "",
  vetId: "",
  date: "",
  durationMin: DEFAULT_DURATION_MIN,
  type: "consultation",
  status: "scheduled",
  reason: "",
  notes: ""
};

export const INITIAL_STATE = {
  APPOINTMENTS_PAGE: {
    items: [],
    loading: true,
    query: "",
    typeFilter: "all",
    statusFilter: "all",
    mode: "list",
    view: "list",
    weekStart: "",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies AppointmentsDataType
};
