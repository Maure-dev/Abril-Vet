import { useScrollToTop } from "@app/modules/main/hooks/useScrollToTop";
import AppGateInterface from "@app/modules/main/interfaces/appGateInterface";
import MainProvider from "@app/modules/main/states/mainProvider";
import { Outlet } from "react-router";

// Layout raíz: estado global (sesión de Firebase Auth) y compuerta de arranque (loader).
// El shell interno (sidebar + topbar) y el layout de auth se montan como layouts hijos.
export default function MainModuleProvider() {
  useScrollToTop();

  return (
    <MainProvider>
      <AppGateInterface>
        <Outlet />
      </AppGateInterface>
    </MainProvider>
  );
}
