import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
// Estado calculado de una desparasitación en base a la próxima dosis.
export type DewormingStatusType = "applied" | "pending" | "overdue";

// Filtro de estado en la lista ("all" = todos).
export type DewormingStatusFilterType = DewormingStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type DewormingsModeType = "list" | "create" | "edit" | "detail";

// ── Desparasitación (registro de aplicación) ──
export type DewormingType = {
  id: string;
  patientId: string; // paciente desparasitado
  productName: string; // antiparasitario usado
  date: string; // aplicación (ISO yyyy-mm-dd)
  nextDoseDate: string; // próxima dosis (ISO yyyy-mm-dd) o "" si no aplica
  weightKg: string; // peso al momento de la aplicación (opcional)
  vetId: string; // veterinario que aplicó
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type DewormingInputType = Omit<DewormingType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type DewormingFormType = {
  patientId: string;
  productName: string;
  date: string;
  nextDoseDate: string;
  weightKg: string;
  vetId: string;
  notes: string;
};

export type DewormingFormErrorsType = Partial<Record<keyof DewormingFormType, string>>;

// Precarga del alta desde un turno (deep-link ?patientId&vetId&date en "Registrar atención").
export type DewormingPrefillType = {
  patientId?: string;
  vetId?: string;
  date?: string;
};

// ── Estado y contexto del módulo ──
export type DewormingsDataType = {
  items: DewormingType[];
  loading: boolean;
  query: string;
  statusFilter: DewormingStatusFilterType;
  mode: DewormingsModeType;
  selected: DewormingType | null;
  form: DewormingFormType;
  errors: DewormingFormErrorsType;
  saving: boolean;
};

export type DewormingsContextType = {
  getDewormingsState: DewormingsDataType;
  setDewormingsState: Dispatch<SetStateAction<DewormingsDataType>>;
};
