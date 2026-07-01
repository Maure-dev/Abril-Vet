import type { BillingDataType } from "@app/modules/billing/entities/entities";

export const INITIAL_STATE = {
  BILLING_PAGE: {
    items: [],
    loading: false
  } satisfies BillingDataType
};
