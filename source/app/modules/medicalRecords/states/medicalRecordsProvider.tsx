import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/medicalRecords/constants/constants";
import type { MedicalRecordsDataType } from "@app/modules/medicalRecords/entities/entities";
import { useContext, useState } from "react";
import { MedicalRecordsContext } from "./medicalRecordsContext";

export default function MedicalRecordsProvider({ children }: ChildrenType) {
  const [getMedicalRecordsState, setMedicalRecordsState] = useState<MedicalRecordsDataType>(
    INITIAL_STATE.MEDICAL_RECORDS_PAGE as MedicalRecordsDataType
  );

  return (
    <MedicalRecordsContext.Provider
      value={{
        getMedicalRecordsState: getMedicalRecordsState,
        setMedicalRecordsState: setMedicalRecordsState
      }}
    >
      {children}
    </MedicalRecordsContext.Provider>
  );
}

export const useMedicalRecordsProvider = () => {
  return useContext(MedicalRecordsContext);
};
