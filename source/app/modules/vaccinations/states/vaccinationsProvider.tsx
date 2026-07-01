import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/vaccinations/constants/constants";
import type { VaccinationsDataType } from "@app/modules/vaccinations/entities/entities";
import { useContext, useState } from "react";
import { VaccinationsContext } from "./vaccinationsContext";

export default function VaccinationsProvider({ children }: ChildrenType) {
  const [getVaccinationsState, setVaccinationsState] = useState<VaccinationsDataType>(
    INITIAL_STATE.VACCINATIONS_PAGE as VaccinationsDataType
  );

  return (
    <VaccinationsContext.Provider
      value={{
        getVaccinationsState: getVaccinationsState,
        setVaccinationsState: setVaccinationsState
      }}
    >
      {children}
    </VaccinationsContext.Provider>
  );
}

export const useVaccinationsProvider = () => {
  return useContext(VaccinationsContext);
};
