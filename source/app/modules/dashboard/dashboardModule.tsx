import { useDashboardData } from "@app/modules/dashboard/hooks/useDashboardData";
import DashboardKpisInterface from "@app/modules/dashboard/interfaces/dashboardKpisInterface";
import DashboardPanelsInterface from "@app/modules/dashboard/interfaces/dashboardPanelsInterface";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";

export default function DashboardModule() {
  const { kpis, userName } = useDashboardData();

  useDocumentHead({
    title: "Panel",
    description: "Panel de control de la veterinaria."
  });

  return (
    <section className="flex flex-col gap-6">
      <PageHeaderInterface
        title={userName ? `Hola, ${userName}` : "Panel"}
        subtitle="Resumen de la actividad de la veterinaria."
      />
      <DashboardKpisInterface kpis={kpis} />
      <DashboardPanelsInterface />
    </section>
  );
}
