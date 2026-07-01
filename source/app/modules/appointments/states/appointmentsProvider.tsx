import { INITIAL_STATE } from "@app/modules/appointments/constants/constants";
import type { AppointmentsDataType } from "@app/modules/appointments/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { AppointmentsContext } from "./appointmentsContext";

export default function AppointmentsProvider({ children }: ChildrenType) {
  const [getAppointmentsState, setAppointmentsState] = useState<AppointmentsDataType>(
    INITIAL_STATE.APPOINTMENTS_PAGE as AppointmentsDataType
  );

  return (
    <AppointmentsContext.Provider
      value={{
        getAppointmentsState: getAppointmentsState,
        setAppointmentsState: setAppointmentsState
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export const useAppointmentsProvider = () => {
  return useContext(AppointmentsContext);
};
