import { INITIAL_STATE } from "@app/modules/billing/constants/constants";
import type { BillingDataType } from "@app/modules/billing/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { BillingContext } from "./billingContext";

export default function BillingProvider({ children }: ChildrenType) {
  const [getBillingState, setBillingState] = useState<BillingDataType>(
    INITIAL_STATE.BILLING_PAGE as BillingDataType
  );

  return (
    <BillingContext.Provider
      value={{ getBillingState: getBillingState, setBillingState: setBillingState }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export const useBillingProvider = () => {
  return useContext(BillingContext);
};
