import VaccinationsProvider from "@app/modules/vaccinations/states/vaccinationsProvider";
import VaccinationsModule from "./vaccinationsModule";

export default function VaccinationsModuleProvider() {
  return (
    <VaccinationsProvider>
      <VaccinationsModule />
    </VaccinationsProvider>
  );
}
