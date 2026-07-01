import type { PatientsContextType } from "@app/modules/patients/entities/entities";
import { createContext } from "react";

export const PatientsContext = createContext<PatientsContextType | null>(null);
