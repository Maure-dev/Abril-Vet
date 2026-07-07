import { INITIAL_STATE } from "@app/modules/dewormings/constants/constants";
import type { DewormingsDataType } from "@app/modules/dewormings/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { DewormingsContext } from "./dewormingsContext";

export default function DewormingsProvider({ children }: ChildrenType) {
  const [getDewormingsState, setDewormingsState] = useState<DewormingsDataType>(
    INITIAL_STATE.DEWORMINGS_PAGE as DewormingsDataType
  );

  return (
    <DewormingsContext.Provider
      value={{
        getDewormingsState: getDewormingsState,
        setDewormingsState: setDewormingsState
      }}
    >
      {children}
    </DewormingsContext.Provider>
  );
}

export const useDewormingsProvider = () => {
  return useContext(DewormingsContext);
};
