import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import { CATEGORY_LABELS } from "@app/modules/products/constants/constants";
import type {
  ProductCategoryType,
  ProductFormErrorsType,
  ProductFormType
} from "@app/modules/products/entities/entities";

type Props = {
  form: ProductFormType;
  errors: ProductFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof ProductFormType>(field: K, value: ProductFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as ProductCategoryType[];

export default function ProductsFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const { options: supplierOptions, loading } = useEntityOptions("suppliers");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Código" error={errors.code} required>
          <InputInterface value={form.code} onChange={(e) => onChange("code", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Código de barras">
          <InputInterface
            value={form.barcode}
            onChange={(e) => onChange("barcode", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Nombre" error={errors.name} required>
          <InputInterface value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Categoría">
          <SelectInterface
            value={form.category}
            onChange={(e) => onChange("category", e.target.value as ProductCategoryType)}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Marca">
          <InputInterface value={form.brand} onChange={(e) => onChange("brand", e.target.value)} />
        </FieldInterface>
        <EntitySelectInterface
          label="Proveedor"
          value={form.supplierId}
          onChange={(id) => onChange("supplierId", id)}
          options={supplierOptions}
          loading={loading}
          placeholder="Seleccioná el proveedor"
          emptyHint="No hay proveedores. Cargá uno en Proveedores."
        />
        <FieldInterface label="Precio de costo (ARS)" error={errors.costPrice}>
          <InputInterface
            type="number"
            step="1"
            min="0"
            value={form.costPrice}
            onChange={(e) => onChange("costPrice", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Precio de venta (ARS)" error={errors.salePrice} required>
          <InputInterface
            type="number"
            step="1"
            min="0"
            value={form.salePrice}
            onChange={(e) => onChange("salePrice", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="IVA (%)" error={errors.ivaPct}>
          <InputInterface
            type="number"
            step="1"
            min="0"
            value={form.ivaPct}
            onChange={(e) => onChange("ivaPct", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Unidad" hint="Ej: unidad, caja, kg, ml">
          <InputInterface value={form.unit} onChange={(e) => onChange("unit", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Stock" error={errors.stock}>
          <InputInterface
            type="number"
            step="1"
            min="0"
            value={form.stock}
            onChange={(e) => onChange("stock", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Stock mínimo" error={errors.minStock}>
          <InputInterface
            type="number"
            step="1"
            min="0"
            value={form.minStock}
            onChange={(e) => onChange("minStock", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Fecha de vencimiento" error={errors.expirationDate}>
          <InputInterface
            type="date"
            value={form.expirationDate}
            onChange={(e) => onChange("expirationDate", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Lote">
          <InputInterface value={form.batch} onChange={(e) => onChange("batch", e.target.value)} />
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
        submitLabel={isEdit ? "Guardar cambios" : "Crear producto"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
