import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/studies/constants/constants";
import type { StudiesDataType } from "@app/modules/studies/entities/entities";
import { useContext, useState } from "react";
import { StudiesContext } from "./studiesContext";

export default function StudiesProvider({ children }: ChildrenType) {
  const [getStudiesState, setStudiesState] = useState<StudiesDataType>(
    INITIAL_STATE.STUDIES_PAGE as StudiesDataType
  );

  return (
    <StudiesContext.Provider
      value={{ getStudiesState: getStudiesState, setStudiesState: setStudiesState }}
    >
      {children}
    </StudiesContext.Provider>
  );
}

export const useStudiesProvider = () => {
  return useContext(StudiesContext);
};
