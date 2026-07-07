import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type HospitalizationStatusType = "active" | "discharged";

// Filtro de estado en la lista ("all" = todos).
export type HospitalizationStatusFilterType = HospitalizationStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type HospitalizationsModeType = "list" | "create" | "edit" | "detail";

// ── Internación ──
export type HospitalizationType = {
  id: string;
  patientId: string; // paciente internado (referencia por ID)
  admissionDate: string; // ISO (yyyy-mm-dd)
  dischargeDate: string; // ISO (yyyy-mm-dd) o "" si sigue internado
  status: HospitalizationStatusType;
  reason: string;
  dailyNotes: string;
  medication: string;
  feeding: string;
  controls: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type HospitalizationInputType = Omit<HospitalizationType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type HospitalizationFormType = {
  patientId: string;
  admissionDate: string;
  dischargeDate: string;
  status: HospitalizationStatusType;
  reason: string;
  dailyNotes: string;
  medication: string;
  feeding: string;
  controls: string;
  notes: string;
};

export type HospitalizationFormErrorsType = Partial<Record<keyof HospitalizationFormType, string>>;

// Precarga del alta desde un turno ("Registrar atención"): campos que llegan por query params.
export type HospitalizationPrefillType = {
  patientId?: string;
  vetId?: string;
  date?: string;
};

// ── Estado y contexto del módulo ──
export type HospitalizationsDataType = {
  items: HospitalizationType[];
  loading: boolean;
  query: string;
  statusFilter: HospitalizationStatusFilterType;
  mode: HospitalizationsModeType;
  selected: HospitalizationType | null;
  form: HospitalizationFormType;
  errors: HospitalizationFormErrorsType;
  saving: boolean;
};

export type HospitalizationsContextType = {
  getHospitalizationsState: HospitalizationsDataType;
  setHospitalizationsState: Dispatch<SetStateAction<HospitalizationsDataType>>;
};
