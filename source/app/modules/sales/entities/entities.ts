import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Ventas (POS). Este es un tipo base de ejemplo.
export type SalesItemType = {
  id: string;
  name: string;
};

export type SalesDataType = {
  items: SalesItemType[];
  loading: boolean;
};

export type SalesContextType = {
  getSalesState: SalesDataType;
  setSalesState: Dispatch<SetStateAction<SalesDataType>>;
};
