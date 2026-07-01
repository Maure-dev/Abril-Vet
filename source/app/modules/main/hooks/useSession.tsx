import type { UserRoleType } from "@app/modules/main/entities/entities";
import { auth } from "@app/modules/main/services/firebase";
import { useMainProvider } from "@app/modules/main/states/mainProvider";
import { signOut } from "firebase/auth";

// Hook compartido de sesión. Lee el estado de auth que MainProvider mantiene
// suscrito a onAuthStateChanged. El rol viene del custom claim del token (no de un campo en DB).
export const useSession = () => {
  const { getMainState } = useMainProvider();
  const { session } = getMainState;
  const role = session.user?.role ?? null;

  // Cierra la sesión en Firebase; onAuthStateChanged actualiza el estado a "guest".
  const logout = async (): Promise<void> => {
    if (auth) {
      await signOut(auth);
    }
  };

  // Chequea si el usuario tiene alguno de los roles indicados.
  const hasRole = (roles: UserRoleType[]): boolean => {
    return role !== null && roles.includes(role);
  };

  return {
    session: session,
    user: session.user,
    role: role,
    loading: session.status === "loading",
    isAuthenticated: session.status === "authenticated",
    isAdmin: role === "admin",
    hasRole: hasRole,
    logout: logout
  };
};
