import type { StudiesDataType } from "@app/modules/studies/entities/entities";

export const INITIAL_STATE = {
  STUDIES_PAGE: {
    items: [],
    loading: false
  } satisfies StudiesDataType
};
