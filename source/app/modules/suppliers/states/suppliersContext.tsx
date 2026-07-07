import type { SuppliersContextType } from "@app/modules/suppliers/entities/entities";
import { createContext } from "react";

export const SuppliersContext = createContext<SuppliersContextType | null>(null);
