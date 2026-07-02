import type { DashboardDataType } from "@app/modules/dashboard/entities/entities";

export const INITIAL_STATE = {
  DASHBOARD_PAGE: {
    loading: true,
    kpis: [],
    appointments: [],
    weekStart: "",
    todayAppointments: [],
    upcomingAppointments: [],
    pendingVaccinations: [],
    hospitalized: []
  } satisfies DashboardDataType
};
