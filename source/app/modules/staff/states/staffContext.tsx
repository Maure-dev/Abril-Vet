import type { StaffContextType } from "@app/modules/staff/entities/entities";
import { createContext } from "react";

export const StaffContext = createContext<StaffContextType | null>(null);
