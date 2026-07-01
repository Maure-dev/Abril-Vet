import type { DashboardContextType } from "@app/modules/dashboard/entities/entities";
import { createContext } from "react";

export const DashboardContext = createContext<DashboardContextType | null>(null);
