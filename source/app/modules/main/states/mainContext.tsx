import type { MainContextType } from "@app/modules/main/entities/entities";
import { createContext } from "react";

export const MainContext = createContext<MainContextType | null>(null);
