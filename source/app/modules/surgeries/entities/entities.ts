import type { AttachmentType } from "@app/modules/main/entities/entities";
import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type SurgeryStatusType = "scheduled" | "done" | "cancelled";

// Filtro de estado en la lista ("all" = todos).
export type SurgeryStatusFilterType = SurgeryStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type SurgeriesModeType = "list" | "create" | "edit" | "detail";

// ── Cirugía ──
export type SurgeryType = {
  id: string;
  patientId: string; // paciente operado (referencia por ID)
  date: string; // ISO (yyyy-mm-dd)
  type: string;
  vetId: string; // cirujano responsable (referencia por ID)
  assistants: string; // ayudantes (texto libre)
  diagnosis: string;
  medication: string;
  evolution: string;
  status: SurgeryStatusType;
  notes: string;
  attachments: AttachmentType[]; // adjuntos (imágenes, PDFs) subidos a Cloudinary
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type SurgeryInputType = Omit<SurgeryType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type SurgeryFormType = {
  patientId: string;
  date: string;
  type: string;
  vetId: string;
  assistants: string;
  diagnosis: string;
  medication: string;
  evolution: string;
  status: SurgeryStatusType;
  notes: string;
  attachments: AttachmentType[];
};

export type SurgeryFormErrorsType = Partial<Record<keyof SurgeryFormType, string>>;

// Campos para precargar el alta desde un turno (deep-link ?patientId&vetId&date).
export type SurgeryPrefillType = {
  patientId?: string;
  vetId?: string;
  date?: string;
};

// ── Estado y contexto del módulo ──
export type SurgeriesDataType = {
  items: SurgeryType[];
  loading: boolean;
  query: string;
  statusFilter: SurgeryStatusFilterType;
  mode: SurgeriesModeType;
  selected: SurgeryType | null;
  form: SurgeryFormType;
  errors: SurgeryFormErrorsType;
  saving: boolean;
};

export type SurgeriesContextType = {
  getSurgeriesState: SurgeriesDataType;
  setSurgeriesState: Dispatch<SetStateAction<SurgeriesDataType>>;
};
