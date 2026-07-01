import type { VaccinationsDataType } from "@app/modules/vaccinations/entities/entities";

export const INITIAL_STATE = {
  VACCINATIONS_PAGE: {
    items: [],
    loading: false
  } satisfies VaccinationsDataType
};
