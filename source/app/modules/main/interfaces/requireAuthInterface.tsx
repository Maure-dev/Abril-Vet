import type { UserRoleType } from "@app/modules/main/entities/entities";
import { useNotification } from "@app/modules/main/hooks/useNotification";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { useSession } from "@app/modules/main/hooks/useSession";
import LoadingInterface from "@app/modules/main/interfaces/loadingInterface";
import { useEffect } from "react";
import { Outlet } from "react-router";

type Props = {
  // Si se pasa, sólo estos roles pueden entrar; si se omite, alcanza con estar autenticado.
  roles?: UserRoleType[];
};

// Guard de rutas: exige sesión (y opcionalmente ciertos roles). Envuelve rutas con <Outlet/>.
export default function RequireAuthInterface({ roles }: Props) {
  const { loading, isAuthenticated, hasRole } = useSession();
  const router = useRouter();
  const { onNotification } = useNotification();
  const allowed = !roles || hasRole(roles);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!isAuthenticated) {
      router.navigate("/ingresar", { state: { returnTo: router.pathname } });
      return;
    }
    if (!allowed) {
      onNotification(false, "No tenés permiso para acceder a esa sección.");
      router.navigate("/");
    }
  }, [loading, isAuthenticated, allowed]);

  if (loading || !isAuthenticated || !allowed) {
    return <LoadingInterface />;
  }
  return <Outlet />;
}
