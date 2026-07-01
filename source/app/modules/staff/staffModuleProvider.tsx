import StaffProvider from "@app/modules/staff/states/staffProvider";
import StaffModule from "./staffModule";

export default function StaffModuleProvider() {
  return (
    <StaffProvider>
      <StaffModule />
    </StaffProvider>
  );
}
