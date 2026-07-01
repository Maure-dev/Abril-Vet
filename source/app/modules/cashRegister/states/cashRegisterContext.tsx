import type { CashRegisterContextType } from "@app/modules/cashRegister/entities/entities";
import { createContext } from "react";

export const CashRegisterContext = createContext<CashRegisterContextType | null>(null);
