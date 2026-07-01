import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/patients/constants/constants";
import type { PatientsDataType } from "@app/modules/patients/entities/entities";
import { useContext, useState } from "react";
import { PatientsContext } from "./patientsContext";

export default function PatientsProvider({ children }: ChildrenType) {
  const [getPatientsState, setPatientsState] = useState<PatientsDataType>(
    INITIAL_STATE.PATIENTS_PAGE as PatientsDataType
  );

  return (
    <PatientsContext.Provider
      value={{ getPatientsState: getPatientsState, setPatientsState: setPatientsState }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export const usePatientsProvider = () => {
  return useContext(PatientsContext);
};
