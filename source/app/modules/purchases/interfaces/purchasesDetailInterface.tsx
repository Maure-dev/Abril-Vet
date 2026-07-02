import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { STATUS_LABELS } from "@app/modules/purchases/constants/constants";
import type {
  PurchaseOrderType,
  PurchaseStatusType
} from "@app/modules/purchases/entities/entities";
import { formatMoney } from "@app/modules/purchases/helpers/formatMoney";

type Props = {
  purchase: PurchaseOrderType;
  onEdit: (purchase: PurchaseOrderType) => void;
  onDelete: (purchase: PurchaseOrderType) => void;
  onBack: () => void;
};

const STATUS_TONE: Record<PurchaseStatusType, "neutral" | "info" | "success" | "error"> = {
  draft: "neutral",
  ordered: "info",
  received: "success",
  cancelled: "error"
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function PurchasesDetailInterface({ purchase, onEdit, onDelete, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">
          {purchase.invoiceNumber ? `Factura ${purchase.invoiceNumber}` : "Orden de compra"}
        </h2>
        <BadgeInterface tone={STATUS_TONE[purchase.status]}>
          {STATUS_LABELS[purchase.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(purchase)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(purchase)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de la compra</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Proveedor" value={purchase.supplierId} />
          <Row label="Fecha" value={purchase.date} />
          <Row label="N° de factura" value={purchase.invoiceNumber} />
          <Row label="Estado" value={STATUS_LABELS[purchase.status]} />
          <Row label="Total" value={formatMoney(purchase.total)} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Ítems</h3>
        {purchase.items.length === 0 ? (
          <p className="text-sm text-ink-soft">Sin ítems cargados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-semibold">Producto</th>
                  <th className="px-3 py-2 font-semibold">Cantidad</th>
                  <th className="px-3 py-2 font-semibold">Costo unitario</th>
                  <th className="px-3 py-2 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {purchase.items.map((item, index) => (
                  <tr key={index} className="border-b border-line/60 last:border-0">
                    <td className="px-3 py-2 font-medium text-ink">{item.productId || "—"}</td>
                    <td className="px-3 py-2 text-ink-soft">{item.quantity}</td>
                    <td className="px-3 py-2 text-ink-soft">{formatMoney(item.unitCost)}</td>
                    <td className="px-3 py-2 text-ink">
                      {formatMoney(item.quantity * item.unitCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardInterface>

      {purchase.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{purchase.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
