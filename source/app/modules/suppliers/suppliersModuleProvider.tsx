import SuppliersProvider from "@app/modules/suppliers/states/suppliersProvider";
import SuppliersModule from "./suppliersModule";

export default function SuppliersModuleProvider() {
  return (
    <SuppliersProvider>
      <SuppliersModule />
    </SuppliersProvider>
  );
}
