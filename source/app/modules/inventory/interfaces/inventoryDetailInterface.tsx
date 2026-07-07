import { MOVEMENT_TYPE_LABELS } from "@app/modules/inventory/constants/constants";
import type { MovementTypeType, StockMovementType } from "@app/modules/inventory/entities/entities";
import { signedQuantity } from "@app/modules/inventory/helpers/signedQuantity";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";

type Props = {
  movement: StockMovementType;
  onEdit: (movement: StockMovementType) => void;
  onDelete: (movement: StockMovementType) => void;
  onBack: () => void;
};

// Tono de la pastilla según el tipo de movimiento.
function typeTone(type: MovementTypeType): "success" | "error" | "warning" | "info" {
  if (type === "in") {
    return "success";
  }
  if (type === "out") {
    return "error";
  }
  if (type === "adjustment") {
    return "warning";
  }
  return "info";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function InventoryDetailInterface({ movement, onEdit, onDelete, onBack }: Props) {
  const { getLabel } = useEntityLookup("products");
  const productLabel = getLabel(movement.productId);
  const signed = signedQuantity(movement);
  const signedLabel = signed > 0 ? `+${signed}` : String(signed);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{productLabel || "—"}</h2>
        <BadgeInterface tone={typeTone(movement.type)}>
          {MOVEMENT_TYPE_LABELS[movement.type]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(movement)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(movement)}
            message="¿Seguro que querés eliminar este movimiento de stock? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos del movimiento</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Fecha" value={movement.date} />
          <Row label="Producto" value={productLabel} />
          <Row label="Tipo" value={MOVEMENT_TYPE_LABELS[movement.type]} />
          <Row label="Cantidad (con signo)" value={signedLabel} />
          <Row label="Motivo" value={movement.reason} />
          <Row label="Depósito" value={movement.warehouse} />
        </dl>
      </CardInterface>

      {movement.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{movement.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
