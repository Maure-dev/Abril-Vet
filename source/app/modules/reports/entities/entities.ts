import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
// Cada métrica cuenta una colección de Firestore. La `key` identifica la métrica.
export type MetricKeyType = "clients" | "patients" | "appointments" | "sales";

// Tono visual de la tarjeta/barra (se mapea a los tonos de marca del design system).
export type MetricToneType = "brand" | "info" | "gold" | "success";

// Modo de la página. El módulo es de sólo lectura, pero mantiene la forma
// list/create/edit/detail de la plantilla `patients` para consistencia estructural.
export type ReportsModeType = "list" | "create" | "edit" | "detail";

// ── Métrica (KPI) ──
export type ReportMetricType = {
  key: MetricKeyType;
  label: string;
  value: number;
  tone: MetricToneType;
};

// Datos que se persistirían (aunque el módulo es de lectura, replica la forma Input de la plantilla).
export type ReportMetricInputType = Omit<ReportMetricType, "key">;

// ── Formulario (todos los campos como string para los inputs) ──
// El dashboard no crea datos; el "form" acota el rango de lectura del reporte.
export type ReportsFormType = {
  label: string;
  fromDate: string;
  toDate: string;
  tone: MetricToneType;
  notes: string;
};

export type ReportsFormErrorsType = Partial<Record<keyof ReportsFormType, string>>;

// ── Estado y contexto del módulo ──
export type ReportsDataType = {
  loading: boolean;
  metrics: ReportMetricType[];
  query: string;
  toneFilter: MetricToneType | "all";
  mode: ReportsModeType;
  selected: ReportMetricType | null;
  form: ReportsFormType;
  errors: ReportsFormErrorsType;
  saving: boolean;
};

export type ReportsContextType = {
  getReportsState: ReportsDataType;
  setReportsState: Dispatch<SetStateAction<ReportsDataType>>;
};
