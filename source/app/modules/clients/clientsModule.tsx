import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Users } from "lucide-react";

export default function ClientsModule() {
  useDocumentHead({
    title: "Clientes",
    description: "Clientes de la veterinaria y sus mascotas asociadas."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Clientes"
        subtitle="Clientes de la veterinaria y sus mascotas asociadas."
      />
      <EmptyStateInterface
        icon={Users}
        title="Modulo en construccion"
        description="Este modulo va a gestionar los clientes, su historial y sus mascotas asociadas. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
