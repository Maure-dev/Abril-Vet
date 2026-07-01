import type { ClientsDataType } from "@app/modules/clients/entities/entities";

export const INITIAL_STATE = {
  CLIENTS_PAGE: {
    items: [],
    loading: false
  } satisfies ClientsDataType
};
