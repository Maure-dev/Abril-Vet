import type { AttachmentType } from "@app/modules/main/entities/entities";
import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type StudyTypeType = "lab" | "ultrasound" | "xray" | "mri" | "echocardiogram" | "other";
export type StudyStatusType = "requested" | "in_progress" | "completed";

// Filtros de la lista ("all" = todos).
export type StudyTypeFilterType = StudyTypeType | "all";
export type StudyStatusFilterType = StudyStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type StudiesModeType = "list" | "create" | "edit" | "detail";

// ── Estudio ──
export type StudyType = {
  id: string;
  patientId: string; // paciente al que pertenece el estudio (referencia por ID)
  type: StudyTypeType;
  name: string;
  date: string | null; // ISO (yyyy-mm-dd)
  requestedBy: string; // profesional que lo solicitó
  result: string;
  status: StudyStatusType;
  attachments: AttachmentType[];
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type StudyInputType = Omit<StudyType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (campos de texto para los inputs) ──
export type StudyFormType = {
  patientId: string;
  type: StudyTypeType;
  name: string;
  date: string;
  requestedBy: string;
  result: string;
  status: StudyStatusType;
  attachments: AttachmentType[];
};

export type StudyFormErrorsType = Partial<Record<keyof StudyFormType, string>>;

// Precarga del alta vía deep-link (p. ej. "Registrar atención" desde un turno).
export type StudyPrefillType = {
  patientId?: string;
  vetId?: string;
  date?: string;
};

// ── Estado y contexto del módulo ──
export type StudiesDataType = {
  items: StudyType[];
  loading: boolean;
  query: string;
  typeFilter: StudyTypeFilterType;
  statusFilter: StudyStatusFilterType;
  mode: StudiesModeType;
  selected: StudyType | null;
  form: StudyFormType;
  errors: StudyFormErrorsType;
  saving: boolean;
};

export type StudiesContextType = {
  getStudiesState: StudiesDataType;
  setStudiesState: Dispatch<SetStateAction<StudiesDataType>>;
};
