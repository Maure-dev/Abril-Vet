import type { InventoryDataType } from "@app/modules/inventory/entities/entities";

export const INITIAL_STATE = {
  INVENTORY_PAGE: {
    items: [],
    loading: false
  } satisfies InventoryDataType
};
