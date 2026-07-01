import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Caja. Este es un tipo base de ejemplo.
export type CashRegisterItemType = {
  id: string;
  name: string;
};

export type CashRegisterDataType = {
  items: CashRegisterItemType[];
  loading: boolean;
};

export type CashRegisterContextType = {
  getCashRegisterState: CashRegisterDataType;
  setCashRegisterState: Dispatch<SetStateAction<CashRegisterDataType>>;
};
