import { DEFAULT_ROLES, INITIAL_STATE } from "@app/modules/main/constants/constants";
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

// Lee los roles del custom claim `roles` (array). Acepta también el claim legacy `role` (string).
// Si no hay ninguno válido, cae al mínimo privilegio.
function resolveRoles(claims: Record<string, unknown>): UserRoleType[] {
  const raw = Array.isArray(claims.roles)
    ? claims.roles
    : typeof claims.role === "string"
      ? [claims.role]
      : [];
  const valid = raw.filter(
    (r): r is UserRoleType => typeof r === "string" && VALID_ROLES.includes(r as UserRoleType)
  );
  return valid.length > 0 ? valid : DEFAULT_ROLES;
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
      let roles: UserRoleType[] = DEFAULT_ROLES;
      try {
        const token = await fbUser.getIdTokenResult();
        roles = resolveRoles(token.claims);
      } catch {
        roles = DEFAULT_ROLES;
      }
      const user: CurrentUserType = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        roles: roles
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
