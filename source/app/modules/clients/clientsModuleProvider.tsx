import ClientsProvider from "@app/modules/clients/states/clientsProvider";
import ClientsModule from "./clientsModule";

export default function ClientsModuleProvider() {
  return (
    <ClientsProvider>
      <ClientsModule />
    </ClientsProvider>
  );
}
