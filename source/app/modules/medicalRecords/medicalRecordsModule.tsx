import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Stethoscope } from "lucide-react";

export default function MedicalRecordsModule() {
  useDocumentHead({
    title: "Historia clinica",
    description: "Historia clinica electronica de cada paciente."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Historia clinica"
        subtitle="Historia clinica electronica de cada paciente."
      />
      <EmptyStateInterface
        icon={Stethoscope}
        title="Modulo en construccion"
        description="Este modulo va a gestionar la historia clinica electronica (motivo, diagnostico, evolucion). La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
