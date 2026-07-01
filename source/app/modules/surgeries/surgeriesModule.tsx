import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Scissors } from "lucide-react";

export default function SurgeriesModule() {
  useDocumentHead({
    title: "Cirugias",
    description: "Cirugias y su seguimiento."
  });

  return (
    <section>
      <PageHeaderInterface title="Cirugias" subtitle="Cirugias y su seguimiento." />
      <EmptyStateInterface
        icon={Scissors}
        title="Modulo en construccion"
        description="Este modulo va a gestionar las cirugias, ayudantes, medicacion y evolucion. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
