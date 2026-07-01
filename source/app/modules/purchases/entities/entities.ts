import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Compras. Este es un tipo base de ejemplo.
export type PurchasesItemType = {
  id: string;
  name: string;
};

export type PurchasesDataType = {
  items: PurchasesItemType[];
  loading: boolean;
};

export type PurchasesContextType = {
  getPurchasesState: PurchasesDataType;
  setPurchasesState: Dispatch<SetStateAction<PurchasesDataType>>;
};
