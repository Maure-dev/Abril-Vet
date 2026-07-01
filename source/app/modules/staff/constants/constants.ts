import type { StaffDataType } from "@app/modules/staff/entities/entities";

export const INITIAL_STATE = {
  STAFF_PAGE: {
    items: [],
    loading: false
  } satisfies StaffDataType
};
