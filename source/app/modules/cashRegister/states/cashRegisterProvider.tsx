import { INITIAL_STATE } from "@app/modules/cashRegister/constants/constants";
import type { CashRegisterDataType } from "@app/modules/cashRegister/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { CashRegisterContext } from "./cashRegisterContext";

export default function CashRegisterProvider({ children }: ChildrenType) {
  const [getCashRegisterState, setCashRegisterState] = useState<CashRegisterDataType>(
    INITIAL_STATE.CASH_REGISTER_PAGE as CashRegisterDataType
  );

  return (
    <CashRegisterContext.Provider
      value={{
        getCashRegisterState: getCashRegisterState,
        setCashRegisterState: setCashRegisterState
      }}
    >
      {children}
    </CashRegisterContext.Provider>
  );
}

export const useCashRegisterProvider = () => {
  return useContext(CashRegisterContext);
};
