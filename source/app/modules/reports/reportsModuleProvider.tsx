import ReportsProvider from "@app/modules/reports/states/reportsProvider";
import ReportsModule from "./reportsModule";

export default function ReportsModuleProvider() {
  return (
    <ReportsProvider>
      <ReportsModule />
    </ReportsProvider>
  );
}
