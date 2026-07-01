import type { SurgeriesContextType } from "@app/modules/surgeries/entities/entities";
import { createContext } from "react";

export const SurgeriesContext = createContext<SurgeriesContextType | null>(null);
