import { useAuthActions } from "@app/modules/auth/hooks/useAuthActions";
import LoginFormInterface from "@app/modules/auth/interfaces/loginFormInterface";
import RecoverFormInterface from "@app/modules/auth/interfaces/recoverFormInterface";
import { useAuthProvider } from "@app/modules/auth/states/authProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { useSession } from "@app/modules/main/hooks/useSession";
import LogoInterface from "@app/modules/main/interfaces/logoInterface";
import ThemeToggleInterface from "@app/modules/main/interfaces/themeToggleInterface";
import { useEffect } from "react";

export default function AuthModule() {
  const { getAuthState } = useAuthProvider();
  const { handleSetMode, handleChangeField, handleLogin, handleRecover } = useAuthActions();
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const state = getAuthState;
  const isRecover = router.pathname.includes("recuperar");

  useDocumentHead({
    title: isRecover ? "Recuperar contraseña" : "Ingresar"
  });

  // Si ya hay sesión, no tiene sentido ver el login.
  useEffect(() => {
    if (isAuthenticated) {
      router.navigate("/");
    }
  }, [isAuthenticated]);

  // Sincroniza el modo del estado con la ruta.
  useEffect(() => {
    handleSetMode(isRecover ? "recover" : "login");
  }, [isRecover]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggleInterface />
      </div>
      <LogoInterface variant="vertical" className="max-h-60" />
      <div className="w-full max-w-sm rounded-card border border-line bg-surface p-6 shadow-card">
        <h1 className="mb-1 font-display text-xl text-brand-fg">
          {isRecover ? "Recuperar contraseña" : "Iniciar sesión"}
        </h1>
        <p className="mb-5 text-sm text-ink-soft">
          {isRecover
            ? "Ingresá tu email y te enviamos las instrucciones."
            : "Accedé al panel de gestión de la veterinaria."}
        </p>
        {isRecover ? (
          <RecoverFormInterface
            state={state}
            onChange={handleChangeField}
            onSubmit={handleRecover}
          />
        ) : (
          <LoginFormInterface state={state} onChange={handleChangeField} onSubmit={handleLogin} />
        )}
      </div>
    </main>
  );
}
