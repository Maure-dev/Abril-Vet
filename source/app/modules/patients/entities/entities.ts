import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type SpeciesType = "dog" | "cat" | "bird" | "rabbit" | "reptile" | "rodent" | "other";
export type SexType = "male" | "female" | "unknown";
export type ReproductiveStatusType = "intact" | "neutered" | "spayed" | "unknown";

// Filtro de especie en la lista ("all" = todas).
export type SpeciesFilterType = SpeciesType | "all";

// Modo de la página (lista / alta / edición / ficha).
export type PatientsModeType = "list" | "create" | "edit" | "detail";

// ── Paciente (mascota) ──
export type PatientType = {
  id: string;
  clientId: string; // dueño (cliente)
  name: string;
  species: SpeciesType;
  breed: string;
  sex: SexType;
  birthDate: string | null; // ISO (yyyy-mm-dd)
  color: string;
  weightKg: number | null;
  microchip: string;
  identificationNumber: string;
  reproductiveStatus: ReproductiveStatusType;
  allergies: string;
  preexistingConditions: string;
  habitualMedication: string;
  notes: string;
  photoUrl: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type PatientInputType = Omit<PatientType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type PatientFormType = {
  clientId: string;
  name: string;
  species: SpeciesType;
  breed: string;
  sex: SexType;
  birthDate: string;
  color: string;
  weightKg: string;
  microchip: string;
  identificationNumber: string;
  reproductiveStatus: ReproductiveStatusType;
  allergies: string;
  preexistingConditions: string;
  habitualMedication: string;
  notes: string;
};

export type PatientFormErrorsType = Partial<Record<keyof PatientFormType, string>>;

// ── Estado y contexto del módulo ──
export type PatientsDataType = {
  items: PatientType[];
  loading: boolean;
  query: string;
  speciesFilter: SpeciesFilterType;
  mode: PatientsModeType;
  selected: PatientType | null;
  form: PatientFormType;
  errors: PatientFormErrorsType;
  saving: boolean;
};

export type PatientsContextType = {
  getPatientsState: PatientsDataType;
  setPatientsState: Dispatch<SetStateAction<PatientsDataType>>;
};
