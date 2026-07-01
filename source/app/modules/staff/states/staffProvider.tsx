import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/staff/constants/constants";
import type { StaffDataType } from "@app/modules/staff/entities/entities";
import { useContext, useState } from "react";
import { StaffContext } from "./staffContext";

export default function StaffProvider({ children }: ChildrenType) {
  const [getStaffState, setStaffState] = useState<StaffDataType>(
    INITIAL_STATE.STAFF_PAGE as StaffDataType
  );

  return (
    <StaffContext.Provider value={{ getStaffState: getStaffState, setStaffState: setStaffState }}>
      {children}
    </StaffContext.Provider>
  );
}

export const useStaffProvider = () => {
  return useContext(StaffContext);
};
