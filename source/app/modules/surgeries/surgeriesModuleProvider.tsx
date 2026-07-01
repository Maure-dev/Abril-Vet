import SurgeriesProvider from "@app/modules/surgeries/states/surgeriesProvider";
import SurgeriesModule from "./surgeriesModule";

export default function SurgeriesModuleProvider() {
  return (
    <SurgeriesProvider>
      <SurgeriesModule />
    </SurgeriesProvider>
  );
}
