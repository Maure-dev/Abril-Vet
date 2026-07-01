import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { ShoppingCart } from "lucide-react";

export default function SalesModule() {
  useDocumentHead({
    title: "Ventas (POS)",
    description: "Punto de venta integrado."
  });

  return (
    <section>
      <PageHeaderInterface title="Ventas (POS)" subtitle="Punto de venta integrado." />
      <EmptyStateInterface
        icon={ShoppingCart}
        title="Modulo en construccion"
        description="Este modulo va a gestionar el punto de venta integrado (productos y servicios en una factura). La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
