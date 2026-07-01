import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Facturacion. Este es un tipo base de ejemplo.
export type BillingItemType = {
  id: string;
  name: string;
};

export type BillingDataType = {
  items: BillingItemType[];
  loading: boolean;
};

export type BillingContextType = {
  getBillingState: BillingDataType;
  setBillingState: Dispatch<SetStateAction<BillingDataType>>;
};
