import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { FlaskConical } from "lucide-react";

export default function StudiesModule() {
  useDocumentHead({
    title: "Estudios",
    description: "Laboratorio, ecografias, radiografias y otros estudios."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Estudios"
        subtitle="Laboratorio, ecografias, radiografias y otros estudios."
      />
      <EmptyStateInterface
        icon={FlaskConical}
        title="Modulo en construccion"
        description="Este modulo va a gestionar los estudios y sus archivos adjuntos (PDFs, imagenes, resultados). La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
