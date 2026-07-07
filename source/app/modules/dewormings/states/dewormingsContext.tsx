import type { DewormingsContextType } from "@app/modules/dewormings/entities/entities";
import { createContext } from "react";

export const DewormingsContext = createContext<DewormingsContextType | null>(null);
