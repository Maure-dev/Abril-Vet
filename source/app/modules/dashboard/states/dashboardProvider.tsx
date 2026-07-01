import { INITIAL_STATE } from "@app/modules/dashboard/constants/constants";
import type { DashboardDataType } from "@app/modules/dashboard/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { DashboardContext } from "./dashboardContext";

export default function DashboardProvider({ children }: ChildrenType) {
  const [getDashboardState, setDashboardState] = useState<DashboardDataType>(
    INITIAL_STATE.DASHBOARD_PAGE as DashboardDataType
  );

  return (
    <DashboardContext.Provider
      value={{ getDashboardState: getDashboardState, setDashboardState: setDashboardState }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardProvider = () => {
  return useContext(DashboardContext);
};
