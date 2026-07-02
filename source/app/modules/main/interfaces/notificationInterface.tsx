import { useMountTransition } from "@app/modules/main/hooks/useMountTransition";
import { AlertCircle, CheckCircle2 } from "@app/modules/main/interfaces/icons";
import { useMainProvider } from "@app/modules/main/states/mainProvider";
import { useEffect } from "react";
import IconInterface from "./iconInterface";

const AUTO_CLOSE_MS = 4000;

// Notificación global (toast): entra/sale con slide-up + fade y se cierra sola.
export default function NotificationInterface() {
  const { getMainState, setMainState } = useMainProvider();
  const { notification } = getMainState;
  const { mounted, state } = useMountTransition(notification.open, 200);

  useEffect(() => {
    if (!notification.open) {
      return;
    }
    const timer = setTimeout(() => {
      setMainState((s) => ({ ...s, notification: { ...s.notification, open: false } }));
    }, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [notification.open, setMainState]);

  // aria-live siempre montado para que los lectores de pantalla anuncien los cambios.
  return (
    <div aria-live="polite" aria-atomic="true" className="fixed bottom-6 right-6 z-50">
      {mounted && (
        <div
          role="alert"
          data-state={state}
          className={`inline-flex items-center gap-2 rounded-buttons px-4 py-3 text-white shadow-soft transition-[opacity,transform] duration-200 ease-out data-[state=closed]:translate-y-3 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100 ${
            notification.status ? "bg-success" : "bg-error"
          }`}
        >
          <IconInterface icon={notification.status ? CheckCircle2 : AlertCircle} size="sm" />
          {notification.message}
        </div>
      )}
    </div>
  );
}
