import { INVOICE_STATUS_LABELS } from "@app/modules/billing/constants/constants";
import type {
  InvoiceStatusFilterType,
  InvoiceStatusType,
  InvoiceType
} from "@app/modules/billing/entities/entities";
import { formatMoney } from "@app/modules/billing/helpers/formatMoney";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, Receipt } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: InvoiceType[];
  query: string;
  statusFilter: InvoiceStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: InvoiceStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (invoice: InvoiceType) => void;
  onOpenEdit: (invoice: InvoiceType) => void;
};

const STATUS_OPTIONS = Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatusType[];

// Tono de la pastilla según el estado de pago.
const STATUS_TONE: Record<InvoiceStatusType, "success" | "warning" | "neutral"> = {
  paid: "success",
  partial: "warning",
  pending: "neutral"
};

export default function BillingListInterface({
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
          placeholder="Buscar por cliente..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as InvoiceStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {INVOICE_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nueva factura</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Receipt}
          title="No hay facturas para mostrar"
          description="Cargá la primera factura o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nueva factura</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(invoice)}
                >
                  <td className="px-4 py-3 text-ink-soft">{invoice.date || "—"}</td>
                  <td className="px-4 py-3 font-medium text-ink">{invoice.clientId}</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatMoney(invoice.total)}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone={STATUS_TONE[invoice.status]}>
                      {INVOICE_STATUS_LABELS[invoice.status]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar factura de ${invoice.clientId}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(invoice);
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
