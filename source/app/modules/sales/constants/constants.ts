import type { SalesDataType } from "@app/modules/sales/entities/entities";

export const INITIAL_STATE = {
  SALES_PAGE: {
    items: [],
    loading: false
  } satisfies SalesDataType
};
