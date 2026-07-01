import type { PurchasesDataType } from "@app/modules/purchases/entities/entities";

export const INITIAL_STATE = {
  PURCHASES_PAGE: {
    items: [],
    loading: false
  } satisfies PurchasesDataType
};
