import type { ReportsDataType } from "@app/modules/reports/entities/entities";

export const INITIAL_STATE = {
  REPORTS_PAGE: {
    items: [],
    loading: false
  } satisfies ReportsDataType
};
