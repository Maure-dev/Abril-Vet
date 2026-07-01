import PatientsProvider from "@app/modules/patients/states/patientsProvider";
import PatientsModule from "./patientsModule";

export default function PatientsModuleProvider() {
  return (
    <PatientsProvider>
      <PatientsModule />
    </PatientsProvider>
  );
}
