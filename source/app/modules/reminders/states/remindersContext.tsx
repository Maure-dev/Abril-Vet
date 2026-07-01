import type { RemindersContextType } from "@app/modules/reminders/entities/entities";
import { createContext } from "react";

export const RemindersContext = createContext<RemindersContextType | null>(null);
