import type { CashRegisterDataType } from "@app/modules/cashRegister/entities/entities";

export const INITIAL_STATE = {
  CASH_REGISTER_PAGE: {
    items: [],
    loading: false
  } satisfies CashRegisterDataType
};
