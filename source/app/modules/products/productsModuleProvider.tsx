import ProductsProvider from "@app/modules/products/states/productsProvider";
import ProductsModule from "./productsModule";

export default function ProductsModuleProvider() {
  return (
    <ProductsProvider>
      <ProductsModule />
    </ProductsProvider>
  );
}
