import { useState } from "react";
import ButtonInterface from "./buttonInterface";
import ConfirmDialogInterface from "./confirmDialogInterface";

type Props = {
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  saving?: boolean;
};

// Acciones de formulario alineadas a la derecha: la acción principal (guardar) pegada al borde
// derecho y la secundaria (cancelar) a su izquierda. Ambas piden confirmación con un modal
// (guardar: confirmar; cancelar: aviso de que se pierde la información no guardada).
export default function FormActionsInterface({
  submitLabel,
  onSubmit,
  onCancel,
  saving = false
}: Props) {
  const [confirm, setConfirm] = useState<"save" | "cancel" | null>(null);

  const handleConfirm = (): void => {
    const pending = confirm;
    setConfirm(null);
    if (pending === "save") {
      onSubmit();
    } else if (pending === "cancel") {
      onCancel();
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <ButtonInterface type="button" variant="ghost" onClick={() => setConfirm("cancel")}>
          Cancelar
        </ButtonInterface>
        <ButtonInterface
          type="button"
          variant="success"
          loading={saving}
          onClick={() => setConfirm("save")}
        >
          {submitLabel}
        </ButtonInterface>
      </div>
      <ConfirmDialogInterface
        open={confirm !== null}
        title={confirm === "cancel" ? "Descartar cambios" : "Guardar cambios"}
        message={
          confirm === "cancel"
            ? "Si salís ahora vas a perder la información no guardada. ¿Querés descartar?"
            : "¿Confirmás que querés guardar los cambios?"
        }
        confirmLabel={confirm === "cancel" ? "Descartar" : "Guardar"}
        tone={confirm === "cancel" ? "danger" : "primary"}
        onConfirm={handleConfirm}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}
