import SalesProvider from "@app/modules/sales/states/salesProvider";
import SalesModule from "./salesModule";

export default function SalesModuleProvider() {
  return (
    <SalesProvider>
      <SalesModule />
    </SalesProvider>
  );
}
