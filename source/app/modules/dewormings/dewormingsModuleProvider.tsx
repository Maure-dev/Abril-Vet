import DewormingsProvider from "@app/modules/dewormings/states/dewormingsProvider";
import DewormingsModule from "./dewormingsModule";

export default function DewormingsModuleProvider() {
  return (
    <DewormingsProvider>
      <DewormingsModule />
    </DewormingsProvider>
  );
}
