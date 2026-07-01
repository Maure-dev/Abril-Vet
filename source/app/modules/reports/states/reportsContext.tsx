import type { ReportsContextType } from "@app/modules/reports/entities/entities";
import { createContext } from "react";

export const ReportsContext = createContext<ReportsContextType | null>(null);
