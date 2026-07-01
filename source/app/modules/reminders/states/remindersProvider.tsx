import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/reminders/constants/constants";
import type { RemindersDataType } from "@app/modules/reminders/entities/entities";
import { useContext, useState } from "react";
import { RemindersContext } from "./remindersContext";

export default function RemindersProvider({ children }: ChildrenType) {
  const [getRemindersState, setRemindersState] = useState<RemindersDataType>(
    INITIAL_STATE.REMINDERS_PAGE as RemindersDataType
  );

  return (
    <RemindersContext.Provider
      value={{ getRemindersState: getRemindersState, setRemindersState: setRemindersState }}
    >
      {children}
    </RemindersContext.Provider>
  );
}

export const useRemindersProvider = () => {
  return useContext(RemindersContext);
};
