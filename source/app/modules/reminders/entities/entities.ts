import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type ReminderTypeType =
  | "appointment"
  | "vaccine"
  | "deworming"
  | "control"
  | "study"
  | "medication";
export type ReminderChannelType = "email";
export type ReminderStatusType = "pending" | "sent" | "cancelled";

// Filtros de la lista ("all" = todos).
export type ReminderTypeFilterType = ReminderTypeType | "all";
export type ReminderStatusFilterType = ReminderStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type RemindersModeType = "list" | "create" | "edit" | "detail";

// ── Recordatorio ──
export type ReminderType = {
  id: string;
  patientId: string; // paciente (mascota)
  clientId: string; // dueño (cliente)
  type: ReminderTypeType;
  channel: ReminderChannelType;
  dueDate: string; // ISO (yyyy-mm-dd)
  message: string;
  status: ReminderStatusType;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type ReminderInputType = Omit<ReminderType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type ReminderFormType = {
  patientId: string;
  clientId: string;
  type: ReminderTypeType;
  channel: ReminderChannelType;
  dueDate: string;
  message: string;
  status: ReminderStatusType;
};

export type ReminderFormErrorsType = Partial<Record<keyof ReminderFormType, string>>;

// ── Estado y contexto del módulo ──
export type RemindersDataType = {
  items: ReminderType[];
  loading: boolean;
  query: string;
  typeFilter: ReminderTypeFilterType;
  statusFilter: ReminderStatusFilterType;
  mode: RemindersModeType;
  selected: ReminderType | null;
  form: ReminderFormType;
  errors: ReminderFormErrorsType;
  saving: boolean;
};

export type RemindersContextType = {
  getRemindersState: RemindersDataType;
  setRemindersState: Dispatch<SetStateAction<RemindersDataType>>;
};
