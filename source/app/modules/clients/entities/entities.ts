import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Clientes. Este es un tipo base de ejemplo.
export type ClientsItemType = {
  id: string;
  name: string;
};

export type ClientsDataType = {
  items: ClientsItemType[];
  loading: boolean;
};

export type ClientsContextType = {
  getClientsState: ClientsDataType;
  setClientsState: Dispatch<SetStateAction<ClientsDataType>>;
};
