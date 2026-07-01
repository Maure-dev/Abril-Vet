import { DEFAULT_ROLE, INITIAL_STATE } from "@app/modules/main/constants/constants";
import type {
  ChildrenType,
  CurrentUserType,
  MainDataType,
  UserRoleType
} from "@app/modules/main/entities/entities";
import { auth, isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "./mainContext";

const VALID_ROLES: UserRoleType[] = ["admin", "vet", "receptionist", "assistant"];

// Lee el rol del custom claim del token (mínimo privilegio si no es válido).
function resolveRole(claim: unknown): UserRoleType {
  return typeof claim === "string" && VALID_ROLES.includes(claim as UserRoleType)
    ? (claim as UserRoleType)
    : DEFAULT_ROLE;
}

export default function MainProvider({ children }: ChildrenType) {
  const [getMainState, setMainState] = useState<MainDataType>(
    INITIAL_STATE.MAIN_PAGE as MainDataType
  );

  // Suscribir el estado de sesión de Firebase Auth. Sin Firebase configurado → "guest".
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setMainState((s) => ({ ...s, session: { status: "guest", user: null } }));
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setMainState((s) => ({ ...s, session: { status: "guest", user: null } }));
        return;
      }
      let role: UserRoleType = DEFAULT_ROLE;
      try {
        const token = await fbUser.getIdTokenResult();
        role = resolveRole(token.claims.role);
      } catch {
        role = DEFAULT_ROLE;
      }
      const user: CurrentUserType = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        role: role
      };
      setMainState((s) => ({ ...s, session: { status: "authenticated", user: user } }));
    });
    return () => unsubscribe();
  }, []);

  return (
    <MainContext.Provider
      value={{
        getMainState: getMainState,
        setMainState: setMainState
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export const useMainProvider = () => {
  return useContext(MainContext);
};
