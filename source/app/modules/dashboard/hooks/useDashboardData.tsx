import { PLACEHOLDER_KPIS } from "@app/modules/dashboard/constants/constants";
import { useSession } from "@app/modules/main/hooks/useSession";

// Datos del panel. Hoy devuelve KPIs de ejemplo; se conectará a Firestore por dominio.
export const useDashboardData = () => {
  const { user } = useSession();
  const name = user?.displayName || user?.email || "";

  return { kpis: PLACEHOLDER_KPIS, userName: name };
};
