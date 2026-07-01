import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { BarChart3 } from "lucide-react";

export default function ReportsModule() {
  useDocumentHead({
    title: "Reportes",
    description: "Reportes y estadisticas clinicas y comerciales."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Reportes"
        subtitle="Reportes y estadisticas clinicas y comerciales."
      />
      <EmptyStateInterface
        icon={BarChart3}
        title="Modulo en construccion"
        description="Este modulo va a gestionar los reportes y estadisticas clinicas y comerciales con graficos. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
