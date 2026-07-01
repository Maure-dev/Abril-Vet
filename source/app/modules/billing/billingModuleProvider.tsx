import BillingProvider from "@app/modules/billing/states/billingProvider";
import BillingModule from "./billingModule";

export default function BillingModuleProvider() {
  return (
    <BillingProvider>
      <BillingModule />
    </BillingProvider>
  );
}
