import type { PurchasesContextType } from "@app/modules/purchases/entities/entities";
import { createContext } from "react";

export const PurchasesContext = createContext<PurchasesContextType | null>(null);
