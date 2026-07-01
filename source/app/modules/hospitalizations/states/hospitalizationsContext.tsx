import type { HospitalizationsContextType } from "@app/modules/hospitalizations/entities/entities";
import { createContext } from "react";

export const HospitalizationsContext = createContext<HospitalizationsContextType | null>(null);
