import type { AppointmentsDataType } from "@app/modules/appointments/entities/entities";

export const INITIAL_STATE = {
  APPOINTMENTS_PAGE: {
    items: [],
    loading: false
  } satisfies AppointmentsDataType
};
