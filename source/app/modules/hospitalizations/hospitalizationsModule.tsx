import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Bed } from "lucide-react";

export default function HospitalizationsModule() {
  useDocumentHead({
    title: "Internaciones",
    description: "Pacientes internados y su evolucion diaria."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Internaciones"
        subtitle="Pacientes internados y su evolucion diaria."
      />
      <EmptyStateInterface
        icon={Bed}
        title="Modulo en construccion"
        description="Este modulo va a gestionar las internaciones, estado, evolucion diaria y controles. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
