import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Boxes } from "lucide-react";

export default function InventoryModule() {
  useDocumentHead({
    title: "Inventario",
    description: "Control de stock y movimientos."
  });

  return (
    <section>
      <PageHeaderInterface title="Inventario" subtitle="Control de stock y movimientos." />
      <EmptyStateInterface
        icon={Boxes}
        title="Modulo en construccion"
        description="Este modulo va a gestionar el control de stock, entradas, salidas, ajustes y alertas. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
