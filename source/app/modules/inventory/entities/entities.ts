import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Inventario. Este es un tipo base de ejemplo.
export type InventoryItemType = {
  id: string;
  name: string;
};

export type InventoryDataType = {
  items: InventoryItemType[];
  loading: boolean;
};

export type InventoryContextType = {
  getInventoryState: InventoryDataType;
  setInventoryState: Dispatch<SetStateAction<InventoryDataType>>;
};
