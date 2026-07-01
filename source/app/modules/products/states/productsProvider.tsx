import type { ChildrenType } from "@app/modules/main/entities/entities";
import { INITIAL_STATE } from "@app/modules/products/constants/constants";
import type { ProductsDataType } from "@app/modules/products/entities/entities";
import { useContext, useState } from "react";
import { ProductsContext } from "./productsContext";

export default function ProductsProvider({ children }: ChildrenType) {
  const [getProductsState, setProductsState] = useState<ProductsDataType>(
    INITIAL_STATE.PRODUCTS_PAGE as ProductsDataType
  );

  return (
    <ProductsContext.Provider
      value={{ getProductsState: getProductsState, setProductsState: setProductsState }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProductsProvider = () => {
  return useContext(ProductsContext);
};
