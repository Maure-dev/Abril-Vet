import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, Truck } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { STATUS_LABELS } from "@app/modules/purchases/constants/constants";
import type {
  PurchaseOrderType,
  PurchaseStatusFilterType,
  PurchaseStatusType
} from "@app/modules/purchases/entities/entities";
import { formatMoney } from "@app/modules/purchases/helpers/formatMoney";

type Props = {
  items: PurchaseOrderType[];
  query: string;
  statusFilter: PurchaseStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: PurchaseStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (purchase: PurchaseOrderType) => void;
  onOpenEdit: (purchase: PurchaseOrderType) => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as PurchaseStatusType[];

// Tono del badge según el estado de la orden.
const STATUS_TONE: Record<PurchaseStatusType, "neutral" | "info" | "success" | "error"> = {
  draft: "neutral",
  ordered: "info",
  received: "success",
  cancelled: "error"
};

export default function PurchasesListInterface({
  items,
  query,
  statusFilter,
  onSearch,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por proveedor o N° de factura..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as PurchaseStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nueva compra</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Truck}
          title="No hay compras para mostrar"
          description="Cargá la primera orden de compra o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nueva compra</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Proveedor</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(purchase)}
                >
                  <td className="px-4 py-3 text-ink-soft">{purchase.date || "—"}</td>
                  <td className="px-4 py-3 font-medium text-ink">{purchase.supplierId || "—"}</td>
                  <td className="px-4 py-3 text-ink">{formatMoney(purchase.total)}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone={STATUS_TONE[purchase.status]}>
                      {STATUS_LABELS[purchase.status]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar compra ${purchase.invoiceNumber || purchase.id}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(purchase);
                      }}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
