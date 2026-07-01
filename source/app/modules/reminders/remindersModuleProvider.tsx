import RemindersProvider from "@app/modules/reminders/states/remindersProvider";
import RemindersModule from "./remindersModule";

export default function RemindersModuleProvider() {
  return (
    <RemindersProvider>
      <RemindersModule />
    </RemindersProvider>
  );
}
