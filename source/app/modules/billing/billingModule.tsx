import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Receipt } from "lucide-react";

export default function BillingModule() {
  useDocumentHead({
    title: "Facturacion",
    description: "Facturacion de consultas, servicios y productos."
  });

  return (
    <section>
      <PageHeaderInterface
        title="Facturacion"
        subtitle="Facturacion de consultas, servicios y productos."
      />
      <EmptyStateInterface
        icon={Receipt}
        title="Modulo en construccion"
        description="Este modulo va a gestionar la facturacion, medios de pago, pagos parciales y estado de cuenta. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
