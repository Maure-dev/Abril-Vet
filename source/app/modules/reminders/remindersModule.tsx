import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Bell } from "lucide-react";

export default function RemindersModule() {
  useDocumentHead({
    title: "Recordatorios",
    description: "Recordatorios automaticos de turnos, vacunas y controles."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Recordatorios"
        subtitle="Recordatorios automaticos de turnos, vacunas y controles."
      />
      <EmptyStateInterface
        icon={Bell}
        title="Modulo en construccion"
        description="Este modulo va a gestionar los recordatorios automaticos por email/WhatsApp. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
