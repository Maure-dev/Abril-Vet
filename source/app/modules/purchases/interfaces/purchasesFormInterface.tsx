import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { Plus, Trash2 } from "@app/modules/main/interfaces/icons";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import { STATUS_LABELS } from "@app/modules/purchases/constants/constants";
import type {
  PurchaseFormErrorsType,
  PurchaseFormType,
  PurchaseItemFormType,
  PurchaseStatusType
} from "@app/modules/purchases/entities/entities";
import { computePurchaseTotal } from "@app/modules/purchases/helpers/computePurchaseTotal";
import { formatMoney } from "@app/modules/purchases/helpers/formatMoney";

type Props = {
  form: PurchaseFormType;
  errors: PurchaseFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof PurchaseFormType>(field: K, value: PurchaseFormType[K]) => void;
  onChangeItem: <K extends keyof PurchaseItemFormType>(
    index: number,
    field: K,
    value: PurchaseItemFormType[K]
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as PurchaseStatusType[];

// Convierte una cantidad/costo del formulario (string) a número seguro para la vista previa.
function toNumber(value: string): number {
  const parsed = Number(value.trim());
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

export default function PurchasesFormInterface({
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
  const { options: productOptions, loading: productsLoading } = useEntityOptions("products");

  const previewTotal = computePurchaseTotal(
    form.items.map((item) => ({
      productId: item.productId,
      quantity: toNumber(item.quantity),
      unitCost: toNumber(item.unitCost)
    }))
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface
          label="Proveedor (ID)"
          error={errors.supplierId}
          hint="Referencia al proveedor"
          required
        >
          <InputInterface
            value={form.supplierId}
            onChange={(e) => onChange("supplierId", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Fecha" error={errors.date}>
          <InputInterface
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as PurchaseStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="N° de factura">
          <InputInterface
            value={form.invoiceNumber}
            onChange={(e) => onChange("invoiceNumber", e.target.value)}
          />
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

        {errors.items ? (
          <p role="alert" className="text-xs text-error">
            {errors.items}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          {form.items.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-card border border-line bg-surface-muted p-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
            >
              <EntitySelectInterface
                label="Producto"
                value={item.productId}
                onChange={(id) => onChangeItem(index, "productId", id)}
                options={productOptions}
                loading={productsLoading}
                placeholder="Seleccioná el producto"
                emptyHint="No hay productos cargados. Cargá uno en Productos."
              />

              <FieldInterface label="Cantidad">
                <InputInterface
                  type="number"
                  step="1"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => onChangeItem(index, "quantity", e.target.value)}
                />
              </FieldInterface>
              <FieldInterface label="Costo unitario (ARS)">
                <InputInterface
                  type="number"
                  step="1"
                  min="0"
                  value={item.unitCost}
                  onChange={(e) => onChangeItem(index, "unitCost", e.target.value)}
                />
              </FieldInterface>
              <button
                type="button"
                aria-label={`Quitar ítem ${index + 1}`}
                className="mb-1.5 inline-flex items-center justify-center gap-1 rounded-buttons px-2 py-2 text-xs text-error hover:bg-error-tint"
                onClick={() => onRemoveItem(index)}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 text-sm text-ink">
          <span className="text-ink-soft">Total:</span>
          <span className="font-display text-base text-brand-fg">{formatMoney(previewTotal)}</span>
        </div>
      </div>

      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear compra"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
