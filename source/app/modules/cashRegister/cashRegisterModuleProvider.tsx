import CashRegisterProvider from "@app/modules/cashRegister/states/cashRegisterProvider";
import CashRegisterModule from "./cashRegisterModule";

export default function CashRegisterModuleProvider() {
  return (
    <CashRegisterProvider>
      <CashRegisterModule />
    </CashRegisterProvider>
  );
}
