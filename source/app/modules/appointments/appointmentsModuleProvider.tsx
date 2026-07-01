import AppointmentsProvider from "@app/modules/appointments/states/appointmentsProvider";
import AppointmentsModule from "./appointmentsModule";

export default function AppointmentsModuleProvider() {
  return (
    <AppointmentsProvider>
      <AppointmentsModule />
    </AppointmentsProvider>
  );
}
