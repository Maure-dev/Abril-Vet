import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Syringe } from "lucide-react";

export default function VaccinationsModule() {
  useDocumentHead({
    title: "Vacunacion",
    description: "Calendario y control de vacunas."
  });

  return (
    <section>
      <PageHeaderInterface title="Vacunacion" subtitle="Calendario y control de vacunas." />
      <EmptyStateInterface
        icon={Syringe}
        title="Modulo en construccion"
        description="Este modulo va a gestionar el calendario de vacunas, proximas aplicaciones y alertas. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
