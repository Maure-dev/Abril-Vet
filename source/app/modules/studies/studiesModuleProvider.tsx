import StudiesProvider from "@app/modules/studies/states/studiesProvider";
import StudiesModule from "./studiesModule";

export default function StudiesModuleProvider() {
  return (
    <StudiesProvider>
      <StudiesModule />
    </StudiesProvider>
  );
}
