import {
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from "@app/modules/billing/constants/constants";
import type { InvoiceStatusType, InvoiceType } from "@app/modules/billing/entities/entities";
import { formatMoney } from "@app/modules/billing/helpers/formatMoney";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";

type Props = {
  invoice: InvoiceType;
  onEdit: (invoice: InvoiceType) => void;
  onDelete: (invoice: InvoiceType) => void;
  onBack: () => void;
};

const STATUS_TONE: Record<InvoiceStatusType, "success" | "warning" | "neutral"> = {
  paid: "success",
  partial: "warning",
  pending: "neutral"
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function BillingDetailInterface({ invoice, onEdit, onDelete, onBack }: Props) {
  const { getLabel: getClientLabel } = useEntityLookup("clients");
  const clientLabel = getClientLabel(invoice.clientId);
  const balance = Math.max(0, invoice.total - invoice.paidAmount);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">Factura · {clientLabel || "—"}</h2>
        <BadgeInterface tone={STATUS_TONE[invoice.status]}>
          {INVOICE_STATUS_LABELS[invoice.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(invoice)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(invoice)}
            message="¿Seguro que querés eliminar esta factura? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos generales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Cliente</dt>
            <dd className="text-sm">
              <EntityLinkInterface kind="clients" id={invoice.clientId} label={clientLabel} />
            </dd>
          </div>
          <Row label="Fecha" value={invoice.date} />
          <Row label="Medio de pago" value={PAYMENT_METHOD_LABELS[invoice.paymentMethod]} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Ítems</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-3 py-2 font-semibold">Descripción</th>
                <th className="px-3 py-2 font-semibold">Cantidad</th>
                <th className="px-3 py-2 font-semibold">Precio unit.</th>
                <th className="px-3 py-2 font-semibold">Importe</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-line/60 last:border-0">
                  <td className="px-3 py-2 text-ink">{item.description}</td>
                  <td className="px-3 py-2 text-ink-soft">{item.quantity}</td>
                  <td className="px-3 py-2 text-ink-soft">{formatMoney(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-ink">
                    {formatMoney(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Totales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Subtotal" value={formatMoney(invoice.subtotal)} />
          <Row label="Descuento" value={formatMoney(invoice.discount)} />
          <Row label="Total" value={formatMoney(invoice.total)} />
          <Row label="Monto pagado" value={formatMoney(invoice.paidAmount)} />
          <Row label="Saldo" value={formatMoney(balance)} />
        </dl>
      </CardInterface>

      {invoice.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{invoice.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
