import PurchasesProvider from "@app/modules/purchases/states/purchasesProvider";
import PurchasesModule from "./purchasesModule";

export default function PurchasesModuleProvider() {
  return (
    <PurchasesProvider>
      <PurchasesModule />
    </PurchasesProvider>
  );
}
