import { INITIAL_STATE } from "@app/modules/inventory/constants/constants";
import type { InventoryDataType } from "@app/modules/inventory/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { InventoryContext } from "./inventoryContext";

export default function InventoryProvider({ children }: ChildrenType) {
  const [getInventoryState, setInventoryState] = useState<InventoryDataType>(
    INITIAL_STATE.INVENTORY_PAGE as InventoryDataType
  );

  return (
    <InventoryContext.Provider
      value={{ getInventoryState: getInventoryState, setInventoryState: setInventoryState }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventoryProvider = () => {
  return useContext(InventoryContext);
};
