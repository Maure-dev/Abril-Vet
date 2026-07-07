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

// Duraciones ofrecidas en el combo (minutos).
export const DURATION_OPTIONS = ["15", "30", "45", "60", "90", "120"] as const;

// Horario de atención de la clínica (minutos desde la medianoche) y granularidad de los turnos.
// El combo de horario ofrece slots dentro de esta ventana, cada SLOT_STEP_MIN minutos.
export const CLINIC_OPEN_MINUTES = 8 * 60; // 08:00
export const CLINIC_CLOSE_MINUTES = 20 * 60; // 20:00
export const SLOT_STEP_MIN = 15;

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
    vetFilter: "all",
    mode: "list",
    view: "week",
    weekStart: "",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies AppointmentsDataType
};
