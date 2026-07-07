import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/suppliers/constants/constants";
import type { SuppliersDataType } from "@app/modules/suppliers/entities/entities";
import { useContext, useState } from "react";
import { SuppliersContext } from "./suppliersContext";

export default function SuppliersProvider({ children }: ChildrenType) {
  const [getSuppliersState, setSuppliersState] = useState<SuppliersDataType>(
    INITIAL_STATE.SUPPLIERS_PAGE as SuppliersDataType
  );

  return (
    <SuppliersContext.Provider
      value={{ getSuppliersState: getSuppliersState, setSuppliersState: setSuppliersState }}
    >
      {children}
    </SuppliersContext.Provider>
  );
}

export const useSuppliersProvider = () => {
  return useContext(SuppliersContext);
};
