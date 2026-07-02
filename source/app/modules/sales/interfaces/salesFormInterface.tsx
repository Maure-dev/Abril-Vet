import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { Plus, Trash2 } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { ITEM_KIND_LABELS, PAYMENT_METHOD_LABELS } from "@app/modules/sales/constants/constants";
import type {
  PaymentMethodType,
  SaleFormErrorsType,
  SaleFormType,
  SaleItemDraftType,
  SaleItemKindType
} from "@app/modules/sales/entities/entities";
import { computeSaleTotals } from "@app/modules/sales/helpers/computeSaleTotals";
import { formatMoney } from "@app/modules/sales/helpers/formatMoney";
import { parseDiscount } from "@app/modules/sales/helpers/saleMappers";

type Props = {
  form: SaleFormType;
  errors: SaleFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof SaleFormType>(field: K, value: SaleFormType[K]) => void;
  onChangeDraft: <K extends keyof SaleItemDraftType>(field: K, value: SaleItemDraftType[K]) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const KIND_OPTIONS = Object.keys(ITEM_KIND_LABELS) as SaleItemKindType[];
const PAYMENT_OPTIONS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethodType[];

export default function SalesFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onChangeDraft,
  onAddItem,
  onRemoveItem,
  onSubmit,
  onCancel
}: Props) {
  const { subtotal, total } = computeSaleTotals(form.items, parseDiscount(form.discount));
  const { options: clientOptions, loading: clientsLoading } = useEntityOptions("clients");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <EntitySelectInterface
          label="Cliente"
          value={form.clientId ?? ""}
          onChange={(id) => onChange("clientId", id)}
          options={clientOptions}
          loading={clientsLoading}
          error={errors.clientId}
          placeholder="Seleccioná el cliente"
          emptyHint="No hay clientes cargados. Creá uno en Clientes."
        />
        <FieldInterface label="Fecha" error={errors.date}>
          <InputInterface
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Medio de pago">
          <SelectInterface
            value={form.paymentMethod}
            onChange={(e) => onChange("paymentMethod", e.target.value as PaymentMethodType)}
          >
            {PAYMENT_OPTIONS.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Agregar ítem</h3>
        <div className="grid gap-3 sm:grid-cols-5 sm:items-end">
          <FieldInterface label="Tipo">
            <SelectInterface
              value={form.draft.kind}
              onChange={(e) => onChangeDraft("kind", e.target.value as SaleItemKindType)}
            >
              {KIND_OPTIONS.map((kind) => (
                <option key={kind} value={kind}>
                  {ITEM_KIND_LABELS[kind]}
                </option>
              ))}
            </SelectInterface>
          </FieldInterface>
          <FieldInterface label="Nombre">
            <InputInterface
              value={form.draft.name}
              onChange={(e) => onChangeDraft("name", e.target.value)}
            />
          </FieldInterface>
          <FieldInterface label="Cantidad">
            <InputInterface
              type="number"
              min="1"
              step="1"
              value={form.draft.quantity}
              onChange={(e) => onChangeDraft("quantity", e.target.value)}
            />
          </FieldInterface>
          <FieldInterface label="Precio unit. (ARS)">
            <InputInterface
              type="number"
              min="0"
              step="1"
              value={form.draft.unitPrice}
              onChange={(e) => onChangeDraft("unitPrice", e.target.value)}
            />
          </FieldInterface>
          <ButtonInterface type="button" variant="secondary" onClick={onAddItem}>
            <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            Agregar
          </ButtonInterface>
        </div>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Carrito</h3>
        {form.items.length === 0 ? (
          <p className="text-sm text-ink-soft">Todavía no agregaste ítems a la venta.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-semibold">Tipo</th>
                  <th className="px-3 py-2 font-semibold">Nombre</th>
                  <th className="px-3 py-2 font-semibold">Cant.</th>
                  <th className="px-3 py-2 font-semibold">Precio</th>
                  <th className="px-3 py-2 font-semibold">Subtotal</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, index) => (
                  <tr
                    key={`${item.name}-${index}`}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="px-3 py-2 text-ink-soft">{ITEM_KIND_LABELS[item.kind]}</td>
                    <td className="px-3 py-2 font-medium text-ink">{item.name}</td>
                    <td className="px-3 py-2 text-ink-soft">{item.quantity}</td>
                    <td className="px-3 py-2 text-ink-soft">{formatMoney(item.unitPrice)}</td>
                    <td className="px-3 py-2 text-ink">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        aria-label={`Quitar ${item.name}`}
                        className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-error hover:bg-error-tint"
                        onClick={() => onRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {errors.items ? (
          <p role="alert" className="mt-3 text-xs text-error">
            {errors.items}
          </p>
        ) : null}
      </CardInterface>

      <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
        <FieldInterface label="Descuento (ARS)" error={errors.discount}>
          <InputInterface
            type="number"
            min="0"
            step="1"
            value={form.discount}
            onChange={(e) => onChange("discount", e.target.value)}
          />
        </FieldInterface>
        <dl className="flex flex-col gap-1 rounded-card border border-line bg-surface-muted p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="text-ink">{formatMoney(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Descuento</dt>
            <dd className="text-ink">{formatMoney(parseDiscount(form.discount))}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-1 font-medium">
            <dt className="text-ink">Total</dt>
            <dd className="text-brand-fg">{formatMoney(total)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Registrar venta"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
