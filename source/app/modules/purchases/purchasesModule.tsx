import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Truck } from "lucide-react";

export default function PurchasesModule() {
  useDocumentHead({
    title: "Compras",
    description: "Compras a proveedores y ordenes de compra."
  });

  return (
    <section>
      <PageHeaderInterface title="Compras" subtitle="Compras a proveedores y ordenes de compra." />
      <EmptyStateInterface
        icon={Truck}
        title="Modulo en construccion"
        description="Este modulo va a gestionar las compras, proveedores, ordenes y recepcion de mercaderia. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
