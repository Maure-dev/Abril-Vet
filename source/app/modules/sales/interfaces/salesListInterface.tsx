import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { Pencil, ShoppingCart } from "@app/modules/main/interfaces/icons";
import { InputInterface } from "@app/modules/main/interfaces/inputInterface";
import { PAYMENT_METHOD_LABELS } from "@app/modules/sales/constants/constants";
import type { SaleType } from "@app/modules/sales/entities/entities";
import { formatMoney } from "@app/modules/sales/helpers/formatMoney";

type Props = {
  items: SaleType[];
  query: string;
  onSearch: (query: string) => void;
  onOpenCreate: () => void;
  onOpenDetail: (sale: SaleType) => void;
  onOpenEdit: (sale: SaleType) => void;
};

function countUnits(sale: SaleType): number {
  return sale.items.reduce((acc, item) => acc + item.quantity, 0);
}

export default function SalesListInterface({
  items,
  query,
  onSearch,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  const { getLabel } = useEntityLookup("clients");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por cliente (ID)..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nueva venta</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={ShoppingCart}
          title="No hay ventas para mostrar"
          description="Registrá la primera venta o ajustá la búsqueda por cliente."
          action={<ButtonInterface onClick={onOpenCreate}>Nueva venta</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Ítems</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((sale) => (
                <tr
                  key={sale.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(sale)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{sale.date}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {sale.clientId ? (
                      <EntityLinkInterface
                        kind="clients"
                        id={sale.clientId}
                        label={getLabel(sale.clientId)}
                      />
                    ) : (
                      "Consumidor final"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone="brand">
                      {sale.items.length} líneas · {countUnits(sale)} u.
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {formatMoney(sale.total)}
                    <span className="ml-2 text-xs text-ink-soft">
                      {PAYMENT_METHOD_LABELS[sale.paymentMethod]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar venta del ${sale.date}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(sale);
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
