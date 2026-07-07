import {
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from "@app/modules/billing/constants/constants";
import type {
  BillingFormErrorsType,
  BillingFormType,
  InvoiceItemFormType,
  InvoiceStatusType,
  PaymentMethodType
} from "@app/modules/billing/entities/entities";
import { computeInvoiceTotals } from "@app/modules/billing/helpers/computeInvoiceTotals";
import { formatMoney } from "@app/modules/billing/helpers/formatMoney";
import { parseAmount, toInvoiceItems } from "@app/modules/billing/helpers/invoiceMappers";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import { Plus, Trash2 } from "@app/modules/main/interfaces/icons";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";

type Props = {
  form: BillingFormType;
  errors: BillingFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof BillingFormType>(field: K, value: BillingFormType[K]) => void;
  onChangeItem: <K extends keyof InvoiceItemFormType>(
    index: number,
    field: K,
    value: InvoiceItemFormType[K]
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const PAYMENT_OPTIONS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethodType[];
const STATUS_OPTIONS = Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatusType[];

export default function BillingFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  onSubmit,
  onCancel
}: Props) {
  const { options: clientOptions, loading: clientsLoading } = useEntityOptions("clients");

  // Vista previa de totales en vivo (mismos cálculos que se persisten).
  const { subtotal, total } = computeInvoiceTotals(
    toInvoiceItems(form.items),
    parseAmount(form.discount)
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <EntitySelectInterface
          label="Cliente"
          value={form.clientId}
          onChange={(id) => onChange("clientId", id)}
          options={clientOptions}
          loading={clientsLoading}
          error={errors.clientId}
          required
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
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as InvoiceStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {INVOICE_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base text-brand-fg">Ítems</h3>
          <ButtonInterface type="button" variant="secondary" size="sm" onClick={onAddItem}>
            <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            Agregar ítem
          </ButtonInterface>
        </div>

        {form.items.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_6rem_8rem_auto] sm:items-end">
            <FieldInterface label="Descripción">
              <InputInterface
                value={item.description}
                onChange={(e) => onChangeItem(index, "description", e.target.value)}
              />
            </FieldInterface>
            <FieldInterface label="Cantidad">
              <InputInterface
                type="number"
                min="0"
                step="1"
                value={item.quantity}
                onChange={(e) => onChangeItem(index, "quantity", e.target.value)}
              />
            </FieldInterface>
            <FieldInterface label="Precio unit.">
              <InputInterface
                type="number"
                min="0"
                step="1"
                value={item.unitPrice}
                onChange={(e) => onChangeItem(index, "unitPrice", e.target.value)}
              />
            </FieldInterface>
            <button
              type="button"
              aria-label={`Quitar ítem ${index + 1}`}
              className="inline-flex items-center justify-center gap-1 rounded-buttons px-3 py-2 text-xs text-error hover:bg-error-tint"
              onClick={() => onRemoveItem(index)}
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              Quitar
            </button>
          </div>
        ))}
        {errors.items ? (
          <p role="alert" className="text-xs text-error">
            {errors.items}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Descuento (ARS)" error={errors.discount}>
          <InputInterface
            type="number"
            min="0"
            step="1"
            value={form.discount}
            onChange={(e) => onChange("discount", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Monto pagado (ARS)" error={errors.paidAmount}>
          <InputInterface
            type="number"
            min="0"
            step="1"
            value={form.paidAmount}
            onChange={(e) => onChange("paidAmount", e.target.value)}
          />
        </FieldInterface>
      </div>

      <div className="flex flex-col gap-1 rounded-card border border-line bg-surface-muted p-4 text-sm">
        <div className="flex items-center justify-between text-ink-soft">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between font-medium text-ink">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Crear factura"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
