import type { DashboardDataType, DashboardKpiType } from "@app/modules/dashboard/entities/entities";
import {
  Bell,
  Calendar,
  PawPrint,
  Receipt,
  ShoppingCart,
  Syringe,
  Users
} from "@app/modules/main/interfaces/icons";

// KPIs de ejemplo. Los valores se conectarán a Firestore cuando se modele cada dominio.
export const PLACEHOLDER_KPIS: DashboardKpiType[] = [
  { key: "appointments", label: "Turnos de hoy", value: "—", tone: "brand", icon: Calendar },
  { key: "activeClients", label: "Clientes activos", value: "—", tone: "info", icon: Users },
  { key: "activePatients", label: "Pacientes activos", value: "—", tone: "brand", icon: PawPrint },
  {
    key: "pendingVaccines",
    label: "Vacunas pendientes",
    value: "—",
    tone: "warning",
    icon: Syringe
  },
  { key: "salesToday", label: "Ventas del día", value: "—", tone: "success", icon: ShoppingCart },
  { key: "billingMonth", label: "Facturación del mes", value: "—", tone: "gold", icon: Receipt },
  { key: "reminders", label: "Recordatorios", value: "—", tone: "neutral", icon: Bell }
];

export const INITIAL_STATE = {
  DASHBOARD_PAGE: {
    loading: false
  } satisfies DashboardDataType
};
