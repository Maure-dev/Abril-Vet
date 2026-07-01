import type { RemindersDataType } from "@app/modules/reminders/entities/entities";

export const INITIAL_STATE = {
  REMINDERS_PAGE: {
    items: [],
    loading: false
  } satisfies RemindersDataType
};
