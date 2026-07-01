import type { AuthContextType } from "@app/modules/auth/entities/entities";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);
