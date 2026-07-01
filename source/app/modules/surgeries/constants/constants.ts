import type { SurgeriesDataType } from "@app/modules/surgeries/entities/entities";

export const INITIAL_STATE = {
  SURGERIES_PAGE: {
    items: [],
    loading: false
  } satisfies SurgeriesDataType
};
