import { useState } from "react";
import ButtonInterface from "./buttonInterface";
import ConfirmDialogInterface from "./confirmDialogInterface";

type Props = {
  onConfirm: () => void;
  label?: string;
  title?: string;
  message?: string;
};

// Botón de eliminar con confirmación (modal danger). Reutilizable en todas las fichas.
export default function DeleteButtonInterface({
  onConfirm,
  label = "Eliminar",
  title = "Eliminar",
  message = "Esta acción no se puede deshacer. ¿Confirmás que querés eliminar este registro?"
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonInterface variant="danger" size="sm" onClick={() => setOpen(true)}>
        {label}
      </ButtonInterface>
      <ConfirmDialogInterface
        open={open}
        title={title}
        message={message}
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={() => {
          setOpen(false);
          onConfirm();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
