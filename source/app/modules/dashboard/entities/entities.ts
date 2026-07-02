import type { LucideIcon } from "@app/modules/main/interfaces/icons";
import type { Dispatch, SetStateAction } from "react";

export type KpiToneType = "brand" | "success" | "warning" | "info" | "gold" | "neutral";

export type DashboardKpiType = {
  key: string;
  label: string;
  value: string;
  hint?: string;
  tone: KpiToneType;
  icon: LucideIcon;
};

export type DashboardDataType = {
  loading: boolean;
};

export type DashboardContextType = {
  getDashboardState: DashboardDataType;
  setDashboardState: Dispatch<SetStateAction<DashboardDataType>>;
};
