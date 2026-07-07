import { MOVEMENT_TYPE_LABELS } from "@app/modules/inventory/constants/constants";
import type {
  MovementFormErrorsType,
  MovementFormType,
  MovementTypeType
} from "@app/modules/inventory/entities/entities";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";

type Props = {
  form: MovementFormType;
  errors: MovementFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof MovementFormType>(field: K, value: MovementFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const TYPE_OPTIONS = Object.keys(MOVEMENT_TYPE_LABELS) as MovementTypeType[];

export default function InventoryFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const { options: productOptions, loading: productsLoading } = useEntityOptions("products");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <EntitySelectInterface
          label="Producto"
          value={form.productId}
          onChange={(id) => onChange("productId", id)}
          options={productOptions}
          loading={productsLoading}
          error={errors.productId}
          required
          placeholder="Seleccioná el producto"
          emptyHint="No hay productos cargados. Cargá uno en Productos."
        />

        <FieldInterface label="Tipo">
          <SelectInterface
            value={form.type}
            onChange={(e) => onChange("type", e.target.value as MovementTypeType)}
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {MOVEMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Cantidad" error={errors.quantity} required>
          <InputInterface
            type="number"
            step="1"
            value={form.quantity}
            onChange={(e) => onChange("quantity", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Fecha" error={errors.date}>
          <InputInterface
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Motivo">
          <InputInterface
            value={form.reason}
            onChange={(e) => onChange("reason", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Depósito">
          <InputInterface
            value={form.warehouse}
            onChange={(e) => onChange("warehouse", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Crear movimiento"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
