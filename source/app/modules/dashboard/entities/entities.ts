import type { LucideIcon } from "@app/modules/main/interfaces/icons";
import type { Dispatch, SetStateAction } from "react";

export type KpiToneType = "brand" | "success" | "warning" | "info" | "gold" | "neutral";

export type DashboardKpiType = {
  key: string;
  label: string;
  value: string;
  tone: KpiToneType;
  icon: LucideIcon;
};

// Ítems resumidos para los paneles. El nombre del paciente se resuelve en la UI (useEntityLookup).
export type DashAppointmentType = {
  id: string;
  date: string;
  type: string;
  status: string;
  patientId: string;
};

export type DashVaccinationType = {
  id: string;
  patientId: string;
  vaccineName: string;
  nextDoseDate: string;
};

export type DashHospitalizationType = {
  id: string;
  patientId: string;
  reason: string;
  admissionDate: string;
};

export type DashboardDataType = {
  loading: boolean;
  kpis: DashboardKpiType[];
  appointments: DashAppointmentType[]; // todos los turnos (para el calendario semanal)
  weekStart: string; // lunes visible en el calendario ("" = semana actual)
  todayAppointments: DashAppointmentType[];
  upcomingAppointments: DashAppointmentType[];
  hospitalized: DashHospitalizationType[];
};

export type DashboardContextType = {
  getDashboardState: DashboardDataType;
  setDashboardState: Dispatch<SetStateAction<DashboardDataType>>;
};
