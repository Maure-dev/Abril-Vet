import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Productos. Este es un tipo base de ejemplo.
export type ProductsItemType = {
  id: string;
  name: string;
};

export type ProductsDataType = {
  items: ProductsItemType[];
  loading: boolean;
};

export type ProductsContextType = {
  getProductsState: ProductsDataType;
  setProductsState: Dispatch<SetStateAction<ProductsDataType>>;
};
