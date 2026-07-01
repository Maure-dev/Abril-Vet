import type { AppointmentsContextType } from "@app/modules/appointments/entities/entities";
import { createContext } from "react";

export const AppointmentsContext = createContext<AppointmentsContextType | null>(null);
