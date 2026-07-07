import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { ITEM_KIND_LABELS, PAYMENT_METHOD_LABELS } from "@app/modules/sales/constants/constants";
import type { SaleType } from "@app/modules/sales/entities/entities";
import { formatMoney } from "@app/modules/sales/helpers/formatMoney";

type Props = {
  sale: SaleType;
  onEdit: (sale: SaleType) => void;
  onDelete: (sale: SaleType) => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function SalesDetailInterface({ sale, onEdit, onDelete, onBack }: Props) {
  const { getLabel } = useEntityLookup("clients");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">Venta del {sale.date}</h2>
        <BadgeInterface tone="brand">{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(sale)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(sale)}
            message="¿Seguro que querés eliminar esta venta? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de la venta</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Fecha" value={sale.date} />
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Cliente</dt>
            <dd className="text-sm text-ink">
              {sale.clientId ? (
                <EntityLinkInterface
                  kind="clients"
                  id={sale.clientId}
                  label={getLabel(sale.clientId)}
                />
              ) : (
                "Consumidor final"
              )}
            </dd>
          </div>
          <Row label="Medio de pago" value={PAYMENT_METHOD_LABELS[sale.paymentMethod]} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Detalle</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-3 py-2 font-semibold">Tipo</th>
                <th className="px-3 py-2 font-semibold">Nombre</th>
                <th className="px-3 py-2 font-semibold">Cant.</th>
                <th className="px-3 py-2 font-semibold">Precio</th>
                <th className="px-3 py-2 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={`${item.name}-${index}`} className="border-b border-line/60 last:border-0">
                  <td className="px-3 py-2 text-ink-soft">{ITEM_KIND_LABELS[item.kind]}</td>
                  <td className="px-3 py-2 font-medium text-ink">{item.name}</td>
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
        <dl className="mt-4 flex flex-col gap-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="text-ink">{formatMoney(sale.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Descuento</dt>
            <dd className="text-ink">{formatMoney(sale.discount)}</dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt className="text-ink">Total</dt>
            <dd className="text-brand-fg">{formatMoney(sale.total)}</dd>
          </div>
        </dl>
      </CardInterface>
    </div>
  );
}
