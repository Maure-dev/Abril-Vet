import type { AuthFormType, AuthModeType } from "@app/modules/auth/entities/entities";
import { validateLoginForm, validateRecoverForm } from "@app/modules/auth/helpers/validateAuthForm";
import { sendRecovery, signIn } from "@app/modules/auth/services/services";
import { useAuthProvider } from "@app/modules/auth/states/authProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";
import { useRouter } from "@app/modules/main/hooks/useRouter";

export const useAuthActions = () => {
  const { getAuthState, setAuthState } = useAuthProvider();
  const { onNotification } = useNotification();
  const router = useRouter();

  const handleSetMode = (mode: AuthModeType): void => {
    setAuthState((s) => ({ ...s, mode: mode, errors: {}, recoverySent: false }));
  };

  const handleChangeField = (field: keyof AuthFormType, value: string): void => {
    setAuthState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  const handleLogin = async (): Promise<void> => {
    const { form } = getAuthState;
    const errors = validateLoginForm(form);
    if (Object.keys(errors).length > 0) {
      setAuthState((s) => ({ ...s, errors: errors }));
      return;
    }
    setAuthState((s) => ({ ...s, submitting: true }));
    try {
      await signIn(form.email.trim(), form.password);
      // returnTo lo setea el guard de rutas (RequireAuthInterface) al redirigir a /ingresar.
      const returnTo =
        router.state && typeof router.state === "object" && "returnTo" in router.state
          ? String((router.state as { returnTo?: string }).returnTo)
          : "/";
      router.navigate(returnTo || "/");
    } catch {
      onNotification(false, "No pudimos iniciar sesión. Revisá tu email y contraseña.");
      setAuthState((s) => ({ ...s, submitting: false }));
    }
  };

  const handleRecover = async (): Promise<void> => {
    const { form } = getAuthState;
    const errors = validateRecoverForm(form);
    if (Object.keys(errors).length > 0) {
      setAuthState((s) => ({ ...s, errors: errors }));
      return;
    }
    setAuthState((s) => ({ ...s, submitting: true }));
    try {
      await sendRecovery(form.email.trim());
      setAuthState((s) => ({ ...s, submitting: false, recoverySent: true }));
      onNotification(true, "Te enviamos un email para restablecer tu contraseña.");
    } catch {
      onNotification(false, "No se pudo enviar el email de recuperación.");
      setAuthState((s) => ({ ...s, submitting: false }));
    }
  };

  return { handleSetMode, handleChangeField, handleLogin, handleRecover };
};
