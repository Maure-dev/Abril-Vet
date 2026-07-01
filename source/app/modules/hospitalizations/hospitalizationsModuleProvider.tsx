import HospitalizationsProvider from "@app/modules/hospitalizations/states/hospitalizationsProvider";
import HospitalizationsModule from "./hospitalizationsModule";

export default function HospitalizationsModuleProvider() {
  return (
    <HospitalizationsProvider>
      <HospitalizationsModule />
    </HospitalizationsProvider>
  );
}
