import type { SalesContextType } from "@app/modules/sales/entities/entities";
import { createContext } from "react";

export const SalesContext = createContext<SalesContextType | null>(null);
