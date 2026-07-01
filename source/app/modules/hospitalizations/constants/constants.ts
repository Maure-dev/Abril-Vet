import type { HospitalizationsDataType } from "@app/modules/hospitalizations/entities/entities";

export const INITIAL_STATE = {
  HOSPITALIZATIONS_PAGE: {
    items: [],
    loading: false
  } satisfies HospitalizationsDataType
};
