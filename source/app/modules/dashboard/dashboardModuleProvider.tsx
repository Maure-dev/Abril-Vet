import DashboardProvider from "@app/modules/dashboard/states/dashboardProvider";
import DashboardModule from "./dashboardModule";

export default function DashboardModuleProvider() {
  return (
    <DashboardProvider>
      <DashboardModule />
    </DashboardProvider>
  );
}
