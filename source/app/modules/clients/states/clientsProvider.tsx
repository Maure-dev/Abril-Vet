import { INITIAL_STATE } from "@app/modules/clients/constants/constants";
import type { ClientsDataType } from "@app/modules/clients/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { ClientsContext } from "./clientsContext";

export default function ClientsProvider({ children }: ChildrenType) {
  const [getClientsState, setClientsState] = useState<ClientsDataType>(
    INITIAL_STATE.CLIENTS_PAGE as ClientsDataType
  );

  return (
    <ClientsContext.Provider
      value={{ getClientsState: getClientsState, setClientsState: setClientsState }}
    >
      {children}
    </ClientsContext.Provider>
  );
}

export const useClientsProvider = () => {
  return useContext(ClientsContext);
};
