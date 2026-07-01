import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Calendar } from "lucide-react";

export default function AppointmentsModule() {
  useDocumentHead({
    title: "Agenda",
    description: "Turnos, consultas y servicios agendados."
  });

  return (
    <section>
      <PageHeaderInterface title="Agenda" subtitle="Turnos, consultas y servicios agendados." />
      <EmptyStateInterface
        icon={Calendar}
        title="Modulo en construccion"
        description="Este modulo va a gestionar la agenda de turnos, consultas, cirugias y servicios. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
