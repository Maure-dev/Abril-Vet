import { MOVEMENT_TYPE_LABELS } from "@app/modules/inventory/constants/constants";
import type {
  MovementTypeFilterType,
  MovementTypeType,
  StockMovementType
} from "@app/modules/inventory/entities/entities";
import { signedQuantity } from "@app/modules/inventory/helpers/signedQuantity";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Boxes, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: StockMovementType[];
  query: string;
  typeFilter: MovementTypeFilterType;
  onSearch: (query: string) => void;
  onFilterType: (type: MovementTypeFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (movement: StockMovementType) => void;
  onOpenEdit: (movement: StockMovementType) => void;
};

const TYPE_OPTIONS = Object.keys(MOVEMENT_TYPE_LABELS) as MovementTypeType[];

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

// Cantidad con signo, formateada con "+" explícito cuando es positiva.
function formatSigned(movement: StockMovementType): string {
  const value = signedQuantity(movement);
  return value > 0 ? `+${value}` : String(value);
}

export default function InventoryListInterface({
  items,
  query,
  typeFilter,
  onSearch,
  onFilterType,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  const { getLabel } = useEntityLookup("products");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por producto o motivo..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={typeFilter}
          onChange={(e) => onFilterType(e.target.value as MovementTypeFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los tipos</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {MOVEMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo movimiento</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Boxes}
          title="No hay movimientos para mostrar"
          description="Cargá el primer movimiento o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo movimiento</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Cantidad</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((movement) => {
                const productLabel = getLabel(movement.productId);
                return (
                  <tr
                    key={movement.id}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                    onClick={() => onOpenDetail(movement)}
                  >
                    <td className="px-4 py-3 text-ink-soft">{movement.date || "—"}</td>
                    <td className="px-4 py-3 font-medium text-ink">{productLabel || "—"}</td>
                    <td className="px-4 py-3">
                      <BadgeInterface tone={typeTone(movement.type)}>
                        {MOVEMENT_TYPE_LABELS[movement.type]}
                      </BadgeInterface>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{formatSigned(movement)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Editar movimiento de ${productLabel || "producto"}`}
                        className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(movement);
                        }}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
