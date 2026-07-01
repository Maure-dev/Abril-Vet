import { INITIAL_STATE } from "@app/modules/hospitalizations/constants/constants";
import type { HospitalizationsDataType } from "@app/modules/hospitalizations/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { HospitalizationsContext } from "./hospitalizationsContext";

export default function HospitalizationsProvider({ children }: ChildrenType) {
  const [getHospitalizationsState, setHospitalizationsState] = useState<HospitalizationsDataType>(
    INITIAL_STATE.HOSPITALIZATIONS_PAGE as HospitalizationsDataType
  );

  return (
    <HospitalizationsContext.Provider
      value={{
        getHospitalizationsState: getHospitalizationsState,
        setHospitalizationsState: setHospitalizationsState
      }}
    >
      {children}
    </HospitalizationsContext.Provider>
  );
}

export const useHospitalizationsProvider = () => {
  return useContext(HospitalizationsContext);
};
