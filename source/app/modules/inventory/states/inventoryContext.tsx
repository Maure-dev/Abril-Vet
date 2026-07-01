import type { InventoryContextType } from "@app/modules/inventory/entities/entities";
import { createContext } from "react";

export const InventoryContext = createContext<InventoryContextType | null>(null);
