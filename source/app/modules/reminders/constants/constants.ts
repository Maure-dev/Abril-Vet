import type {
  ReminderChannelType,
  ReminderFormType,
  ReminderStatusType,
  RemindersDataType,
  ReminderTypeType
} from "@app/modules/reminders/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const REMINDER_TYPE_LABELS: Record<ReminderTypeType, string> = {
  appointment: "Turno",
  vaccine: "Vacuna",
  deworming: "Desparasitación",
  control: "Control",
  study: "Estudio",
  medication: "Medicación"
};

export const REMINDER_CHANNEL_LABELS: Record<ReminderChannelType, string> = {
  email: "Email"
};

export const REMINDER_STATUS_LABELS: Record<ReminderStatusType, string> = {
  pending: "Pendiente",
  sent: "Enviado",
  cancelled: "Cancelado"
};

// Formulario vacío (alta de recordatorio).
export const EMPTY_FORM: ReminderFormType = {
  patientId: "",
  clientId: "",
  type: "appointment",
  channel: "email",
  dueDate: "",
  message: "",
  status: "pending"
};

export const INITIAL_STATE = {
  REMINDERS_PAGE: {
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
  } satisfies RemindersDataType
};
