import type { VaccinationsContextType } from "@app/modules/vaccinations/entities/entities";
import { createContext } from "react";

export const VaccinationsContext = createContext<VaccinationsContextType | null>(null);
