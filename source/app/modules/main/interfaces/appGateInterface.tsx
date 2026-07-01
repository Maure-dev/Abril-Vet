import type { ChildrenType } from "@app/modules/main/entities/entities";
import { useSession } from "@app/modules/main/hooks/useSession";
import LogoInterface from "./logoInterface";

// Compuerta de arranque: mientras se resuelve el estado de sesión (Firebase Auth),
// mostramos un loader a pantalla completa; una vez resuelto, renderizamos la app.
export default function AppGateInterface({ children }: ChildrenType) {
  const { loading } = useSession();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas">
        <LogoInterface />
        <div
          role="status"
          aria-label="Cargando Abril Vet"
          className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand"
        />
      </div>
    );
  }

  return <>{children}</>;
}
