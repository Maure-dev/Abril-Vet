import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/surgeries/constants/constants";
import type { SurgeriesDataType } from "@app/modules/surgeries/entities/entities";
import { useContext, useState } from "react";
import { SurgeriesContext } from "./surgeriesContext";

export default function SurgeriesProvider({ children }: ChildrenType) {
  const [getSurgeriesState, setSurgeriesState] = useState<SurgeriesDataType>(
    INITIAL_STATE.SURGERIES_PAGE as SurgeriesDataType
  );

  return (
    <SurgeriesContext.Provider
      value={{ getSurgeriesState: getSurgeriesState, setSurgeriesState: setSurgeriesState }}
    >
      {children}
    </SurgeriesContext.Provider>
  );
}

export const useSurgeriesProvider = () => {
  return useContext(SurgeriesContext);
};
