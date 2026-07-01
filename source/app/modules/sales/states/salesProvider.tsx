import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/sales/constants/constants";
import type { SalesDataType } from "@app/modules/sales/entities/entities";
import { useContext, useState } from "react";
import { SalesContext } from "./salesContext";

export default function SalesProvider({ children }: ChildrenType) {
  const [getSalesState, setSalesState] = useState<SalesDataType>(
    INITIAL_STATE.SALES_PAGE as SalesDataType
  );

  return (
    <SalesContext.Provider value={{ getSalesState: getSalesState, setSalesState: setSalesState }}>
      {children}
    </SalesContext.Provider>
  );
}

export const useSalesProvider = () => {
  return useContext(SalesContext);
};
