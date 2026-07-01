import type { ClientsContextType } from "@app/modules/clients/entities/entities";
import { createContext } from "react";

export const ClientsContext = createContext<ClientsContextType | null>(null);
