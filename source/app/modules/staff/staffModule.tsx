import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { UserCog } from "lucide-react";

export default function StaffModule() {
  useDocumentHead({
    title: "Personal",
    description: "Usuarios del sistema, roles y permisos."
  });

  return (
    <section>
      <PageHeaderInterface title="Personal" subtitle="Usuarios del sistema, roles y permisos." />
      <EmptyStateInterface
        icon={UserCog}
        title="Modulo en construccion"
        description="Este modulo va a gestionar el personal, roles, permisos y auditoria de acciones. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
