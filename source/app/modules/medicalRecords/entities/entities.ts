import type { AttachmentType } from "@app/modules/main/entities/entities";
import type { Dispatch, SetStateAction } from "react";

// Modo de la página (lista / alta / edición / ficha).
export type MedicalRecordsModeType = "list" | "create" | "edit" | "detail";

// ── Historia clínica (registro de consulta) ──
export type MedicalRecordType = {
  id: string;
  patientId: string; // paciente (mascota) al que pertenece el registro
  vetId: string; // profesional que atendió
  date: string; // fecha de la consulta (yyyy-mm-dd)
  reason: string; // motivo de consulta
  anamnesis: string; // antecedentes / relato del dueño
  physicalExam: string; // examen físico
  diagnosis: string; // diagnóstico
  treatment: string; // tratamiento aplicado
  prescription: string; // prescripción / receta
  indications: string; // indicaciones al dueño
  evolution: string; // evolución
  nextControlDate: string; // próximo control (yyyy-mm-dd) o "" si no hay
  attachments: AttachmentType[]; // adjuntos: imágenes, PDFs, resultados de laboratorio
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type MedicalRecordInputType = Omit<MedicalRecordType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (todos los campos como string para los inputs) ──
export type MedicalRecordFormType = {
  patientId: string;
  vetId: string;
  date: string;
  reason: string;
  anamnesis: string;
  physicalExam: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  indications: string;
  evolution: string;
  nextControlDate: string;
  attachments: AttachmentType[]; // adjuntos manejados por FileUploadInterface
};

export type MedicalRecordFormErrorsType = Partial<Record<keyof MedicalRecordFormType, string>>;

// Datos de precarga del alta al llegar desde un turno ("Registrar atención").
export type MedicalRecordPrefillType = {
  patientId?: string;
  vetId?: string;
  date?: string;
};

// ── Estado y contexto del módulo ──
export type MedicalRecordsDataType = {
  items: MedicalRecordType[];
  loading: boolean;
  query: string;
  patientFilter: string; // filtra por patientId (input de texto arriba)
  mode: MedicalRecordsModeType;
  selected: MedicalRecordType | null;
  form: MedicalRecordFormType;
  errors: MedicalRecordFormErrorsType;
  saving: boolean;
};

export type MedicalRecordsContextType = {
  getMedicalRecordsState: MedicalRecordsDataType;
  setMedicalRecordsState: Dispatch<SetStateAction<MedicalRecordsDataType>>;
};
