import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/reports/constants/constants";
import type { ReportsDataType } from "@app/modules/reports/entities/entities";
import { useContext, useState } from "react";
import { ReportsContext } from "./reportsContext";

export default function ReportsProvider({ children }: ChildrenType) {
  const [getReportsState, setReportsState] = useState<ReportsDataType>(
    INITIAL_STATE.REPORTS_PAGE as ReportsDataType
  );

  return (
    <ReportsContext.Provider
      value={{ getReportsState: getReportsState, setReportsState: setReportsState }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export const useReportsProvider = () => {
  return useContext(ReportsContext);
};
