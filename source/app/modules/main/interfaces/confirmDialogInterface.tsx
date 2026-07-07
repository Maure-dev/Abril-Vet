import { useEffect } from "react";
import ButtonInterface from "./buttonInterface";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onClose: () => void;
};

// Modal de confirmación reutilizable (guardar, descartar, eliminar…). Cierra con Escape o clic afuera.
export default function ConfirmDialogInterface({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "primary",
  onConfirm,
  onClose
}: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm animate-fade-in rounded-card border border-line bg-surface p-5 shadow-card"
      >
        <h3 className="mb-2 font-display text-base text-ink">{title}</h3>
        <p className="mb-5 text-sm text-ink-soft">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <ButtonInterface type="button" variant="ghost" onClick={onClose}>
            {cancelLabel}
          </ButtonInterface>
          <ButtonInterface
            type="button"
            variant={tone === "danger" ? "danger" : "success"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </ButtonInterface>
        </div>
      </div>
    </div>
  );
}
