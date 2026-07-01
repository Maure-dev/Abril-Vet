import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Wallet } from "lucide-react";

export default function CashRegisterModule() {
  useDocumentHead({
    title: "Caja",
    description: "Caja diaria: apertura, cierre y arqueo."
  });

  return (
    <section>
      <PageHeaderInterface title="Caja" subtitle="Caja diaria: apertura, cierre y arqueo." />
      <EmptyStateInterface
        icon={Wallet}
        title="Modulo en construccion"
        description="Este modulo va a gestionar la caja diaria, ingresos, egresos y arqueo. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
