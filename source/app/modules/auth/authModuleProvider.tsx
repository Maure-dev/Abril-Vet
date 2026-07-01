import AuthProvider from "@app/modules/auth/states/authProvider";
import AuthModule from "./authModule";

export default function AuthModuleProvider() {
  return (
    <AuthProvider>
      <AuthModule />
    </AuthProvider>
  );
}
