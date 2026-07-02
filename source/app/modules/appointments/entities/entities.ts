import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type AppointmentTypeType =
  | "consultation"
  | "surgery"
  | "vaccination"
  | "grooming"
  | "bath"
  | "other";

export type AppointmentStatusType = "scheduled" | "confirmed" | "cancelled" | "done";

// Filtros de la lista ("all" = todos).
export type AppointmentTypeFilterType = AppointmentTypeType | "all";
export type AppointmentStatusFilterType = AppointmentStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type AppointmentsModeType = "list" | "create" | "edit" | "detail";

// ── Turno (agenda) ──
export type AppointmentType = {
  id: string;
  patientId: string; // paciente (mascota)
  clientId: string; // dueño (cliente)
  vetId: string; // veterinario asignado
  date: string; // ISO datetime (input datetime-local)
  durationMin: number;
  type: AppointmentTypeType;
  status: AppointmentStatusType;
  reason: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type AppointmentInputType = Omit<AppointmentType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type AppointmentFormType = {
  patientId: string;
  clientId: string;
  vetId: string;
  date: string;
  durationMin: string;
  type: AppointmentTypeType;
  status: AppointmentStatusType;
  reason: string;
  notes: string;
};

export type AppointmentFormErrorsType = Partial<Record<keyof AppointmentFormType, string>>;

// ── Estado y contexto del módulo ──
export type AppointmentsDataType = {
  items: AppointmentType[];
  loading: boolean;
  query: string;
  typeFilter: AppointmentTypeFilterType;
  statusFilter: AppointmentStatusFilterType;
  mode: AppointmentsModeType;
  selected: AppointmentType | null;
  form: AppointmentFormType;
  errors: AppointmentFormErrorsType;
  saving: boolean;
};

export type AppointmentsContextType = {
  getAppointmentsState: AppointmentsDataType;
  setAppointmentsState: Dispatch<SetStateAction<AppointmentsDataType>>;
};
