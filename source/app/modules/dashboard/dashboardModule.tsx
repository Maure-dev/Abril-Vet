import { useDashboardData } from "@app/modules/dashboard/hooks/useDashboardData";
import DashboardKpisInterface from "@app/modules/dashboard/interfaces/dashboardKpisInterface";
import DashboardPanelsInterface from "@app/modules/dashboard/interfaces/dashboardPanelsInterface";
import DashboardWeekInterface from "@app/modules/dashboard/interfaces/dashboardWeekInterface";
import { useDashboardProvider } from "@app/modules/dashboard/states/dashboardProvider";
import { startOfWeek, todayStr } from "@app/modules/main/helpers/weekDates";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function DashboardModule() {
  const { getDashboardState } = useDashboardProvider();
  const { load, userName, handlePrevWeek, handleNextWeek, handleToday } = useDashboardData();
  const { navigate } = useRouter();
  const state = getDashboardState;
  const effectiveWeekStart = state.weekStart || startOfWeek(todayStr());

  useDocumentHead({
    title: "Panel",
    description: "Panel de control de la veterinaria."
  });

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <PageHeaderInterface
        title={userName ? `Hola, ${userName}` : "Panel"}
        subtitle="Resumen de la actividad de la veterinaria."
      />
      <DashboardKpisInterface kpis={state.kpis} />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-base text-brand-fg">Agenda de la semana</h2>
        <DashboardWeekInterface
          appointments={state.appointments}
          weekStart={effectiveWeekStart}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
          onOpenAgenda={() => navigate("/agenda")}
        />
      </div>

      <DashboardPanelsInterface
        loading={state.loading}
        todayAppointments={state.todayAppointments}
        upcomingAppointments={state.upcomingAppointments}
        pendingVaccinations={state.pendingVaccinations}
        hospitalized={state.hospitalized}
      />
    </section>
  );
}
