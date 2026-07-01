import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { Package } from "lucide-react";

export default function ProductsModule() {
  useDocumentHead({
    title: "Productos",
    description: "Catalogo de productos e insumos."
  });

  return (
    <section>
      <PageHeaderInterface title="Productos" subtitle="Catalogo de productos e insumos." />
      <EmptyStateInterface
        icon={Package}
        title="Modulo en construccion"
        description="Este modulo va a gestionar el catalogo de productos, precios, IVA y proveedores. La estructura (estado, entities y ruta) ya esta lista para implementarlo."
      />
    </section>
  );
}
