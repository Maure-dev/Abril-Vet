import InventoryProvider from "@app/modules/inventory/states/inventoryProvider";
import InventoryModule from "./inventoryModule";

export default function InventoryModuleProvider() {
  return (
    <InventoryProvider>
      <InventoryModule />
    </InventoryProvider>
  );
}
