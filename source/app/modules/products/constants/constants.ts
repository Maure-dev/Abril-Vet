import type { ProductsDataType } from "@app/modules/products/entities/entities";

export const INITIAL_STATE = {
  PRODUCTS_PAGE: {
    items: [],
    loading: false
  } satisfies ProductsDataType
};
