import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/purchases/constants/constants";
import type { PurchasesDataType } from "@app/modules/purchases/entities/entities";
import { useContext, useState } from "react";
import { PurchasesContext } from "./purchasesContext";

export default function PurchasesProvider({ children }: ChildrenType) {
  const [getPurchasesState, setPurchasesState] = useState<PurchasesDataType>(
    INITIAL_STATE.PURCHASES_PAGE as PurchasesDataType
  );

  return (
    <PurchasesContext.Provider
      value={{ getPurchasesState: getPurchasesState, setPurchasesState: setPurchasesState }}
    >
      {children}
    </PurchasesContext.Provider>
  );
}

export const usePurchasesProvider = () => {
  return useContext(PurchasesContext);
};
