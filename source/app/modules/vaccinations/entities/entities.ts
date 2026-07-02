import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
// Estado calculado de una vacuna en base a la próxima dosis.
export type VaccineStatusType = "applied" | "pending" | "overdue";

// Filtro de estado en la lista ("all" = todos).
export type VaccineStatusFilterType = VaccineStatusType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type VaccinationsModeType = "list" | "create" | "edit" | "detail";

// ── Vacunación (registro de aplicación) ──
export type VaccinationType = {
  id: string;
  patientId: string; // paciente vacunado
  vaccineName: string;
  date: string; // aplicación (ISO yyyy-mm-dd)
  nextDoseDate: string; // próxima dosis (ISO yyyy-mm-dd) o "" si no aplica
  batch: string; // lote
  vetId: string; // veterinario que aplicó
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type VaccinationInputType = Omit<VaccinationType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type VaccinationFormType = {
  patientId: string;
  vaccineName: string;
  date: string;
  nextDoseDate: string;
  batch: string;
  vetId: string;
  notes: string;
};

export type VaccinationFormErrorsType = Partial<Record<keyof VaccinationFormType, string>>;

// ── Estado y contexto del módulo ──
export type VaccinationsDataType = {
  items: VaccinationType[];
  loading: boolean;
  query: string;
  statusFilter: VaccineStatusFilterType;
  mode: VaccinationsModeType;
  selected: VaccinationType | null;
  form: VaccinationFormType;
  errors: VaccinationFormErrorsType;
  saving: boolean;
};

export type VaccinationsContextType = {
  getVaccinationsState: VaccinationsDataType;
  setVaccinationsState: Dispatch<SetStateAction<VaccinationsDataType>>;
};
