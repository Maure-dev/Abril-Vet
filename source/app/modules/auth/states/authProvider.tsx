import { INITIAL_STATE } from "@app/modules/auth/constants/constants";
import type { AuthDataType } from "@app/modules/auth/entities/entities";
import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useContext, useState } from "react";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }: ChildrenType) {
  const [getAuthState, setAuthState] = useState<AuthDataType>(
    INITIAL_STATE.AUTH_PAGE as AuthDataType
  );

  return (
    <AuthContext.Provider value={{ getAuthState: getAuthState, setAuthState: setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthProvider = () => {
  return useContext(AuthContext);
};
