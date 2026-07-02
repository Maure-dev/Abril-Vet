import type {
  DashboardKpiType,
  DashHospitalizationType,
  DashVaccinationType
} from "@app/modules/dashboard/entities/entities";
import {
  countActiveClients,
  countActivePatients,
  fetchActiveHospitalizations,
  fetchAppointments,
  fetchVaccinations,
  sumInvoicesTotal,
  sumSalesTotal
} from "@app/modules/dashboard/services/services";
import { useDashboardProvider } from "@app/modules/dashboard/states/dashboardProvider";
import { addDays, startOfWeek, todayStr } from "@app/modules/main/helpers/weekDates";
import { useSession } from "@app/modules/main/hooks/useSession";
import {
  Bed,
  Calendar,
  PawPrint,
  Receipt,
  ShoppingCart,
  Syringe,
  Users
} from "@app/modules/main/interfaces/icons";

const pad = (n: number): string => String(n).padStart(2, "0");
const money = (value: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);

// Ejecuta una promesa devolviendo un fallback si falla (p. ej. lectura denegada por rol).
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export const useDashboardData = () => {
  const { setDashboardState } = useDashboardProvider();
  const { user, hasRole } = useSession();
  const userName = user?.displayName || user?.email || "";

  const load = async (): Promise<void> => {
    setDashboardState((s) => ({ ...s, loading: true }));
    const isClinical = hasRole(["admin", "vet", "assistant"]);
    const isCommercial = hasRole(["admin", "receptionist"]);
    const now = new Date();
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const month = today.slice(0, 7);

    const [appts, clientsCount, patientsCount, vaccines, hospitalized, salesToday, invoicesMonth] =
      await Promise.all([
        safe(fetchAppointments(), []),
        safe(countActiveClients(), 0),
        safe(countActivePatients(), 0),
        isClinical ? safe(fetchVaccinations(), []) : Promise.resolve([] as DashVaccinationType[]),
        isClinical
          ? safe(fetchActiveHospitalizations(), [])
          : Promise.resolve([] as DashHospitalizationType[]),
        isCommercial ? safe(sumSalesTotal(today), 0) : Promise.resolve(0),
        isCommercial ? safe(sumInvoicesTotal(month), 0) : Promise.resolve(0)
      ]);

    const active = (appt: { status: string }): boolean => appt.status !== "cancelled";
    const todayAppointments = appts
      .filter((a) => a.date.slice(0, 10) === today && active(a))
      .sort((a, b) => a.date.localeCompare(b.date));
    const upcomingAppointments = appts
      .filter((a) => a.date.slice(0, 10) > today && active(a))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6);
    const pendingList = vaccines
      .filter((v) => v.nextDoseDate)
      .sort((a, b) => a.nextDoseDate.localeCompare(b.nextDoseDate));

    const kpis: DashboardKpiType[] = [
      {
        key: "today",
        label: "Turnos de hoy",
        value: String(todayAppointments.length),
        tone: "brand",
        icon: Calendar
      },
      {
        key: "clients",
        label: "Clientes activos",
        value: String(clientsCount),
        tone: "info",
        icon: Users
      },
      {
        key: "patients",
        label: "Pacientes activos",
        value: String(patientsCount),
        tone: "brand",
        icon: PawPrint
      }
    ];
    if (isClinical) {
      kpis.push({
        key: "vaccines",
        label: "Próximas vacunas",
        value: String(pendingList.length),
        tone: "warning",
        icon: Syringe
      });
      kpis.push({
        key: "hospitalized",
        label: "Internados",
        value: String(hospitalized.length),
        tone: "info",
        icon: Bed
      });
    }
    if (isCommercial) {
      kpis.push({
        key: "sales",
        label: "Ventas del día",
        value: money(salesToday),
        tone: "success",
        icon: ShoppingCart
      });
      kpis.push({
        key: "billing",
        label: "Facturación del mes",
        value: money(invoicesMonth),
        tone: "gold",
        icon: Receipt
      });
    }

    setDashboardState((s) => ({
      ...s,
      loading: false,
      kpis: kpis,
      appointments: appts,
      todayAppointments: todayAppointments,
      upcomingAppointments: upcomingAppointments,
      pendingVaccinations: pendingList.slice(0, 6),
      hospitalized: hospitalized.slice(0, 6)
    }));
  };

  const handlePrevWeek = (): void => {
    setDashboardState((s) => ({
      ...s,
      weekStart: addDays(s.weekStart || startOfWeek(todayStr()), -7)
    }));
  };

  const handleNextWeek = (): void => {
    setDashboardState((s) => ({
      ...s,
      weekStart: addDays(s.weekStart || startOfWeek(todayStr()), 7)
    }));
  };

  const handleToday = (): void => {
    setDashboardState((s) => ({ ...s, weekStart: startOfWeek(todayStr()) }));
  };

  return {
    load: load,
    userName: userName,
    handlePrevWeek: handlePrevWeek,
    handleNextWeek: handleNextWeek,
    handleToday: handleToday
  };
};
