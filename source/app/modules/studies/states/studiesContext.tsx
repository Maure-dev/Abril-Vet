import type { StudiesContextType } from "@app/modules/studies/entities/entities";
import { createContext } from "react";

export const StudiesContext = createContext<StudiesContextType | null>(null);
