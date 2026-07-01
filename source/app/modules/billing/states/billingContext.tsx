import type { BillingContextType } from "@app/modules/billing/entities/entities";
import { createContext } from "react";

export const BillingContext = createContext<BillingContextType | null>(null);
