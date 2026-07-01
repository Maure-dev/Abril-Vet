import { useMainProvider } from "@app/modules/main/states/mainProvider";

// Hook compartido para disparar notificaciones (toast) desde cualquier módulo.
export const useNotification = () => {
  const { setMainState } = useMainProvider();

  const onNotification = (status: boolean, message: string): void => {
    setMainState((s) => ({
      ...s,
      notification: { open: true, status: status, message: message }
    }));
  };

  return { onNotification };
};
