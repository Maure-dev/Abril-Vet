import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import type {
  SupplierFormErrorsType,
  SupplierFormType
} from "@app/modules/suppliers/entities/entities";

type Props = {
  form: SupplierFormType;
  errors: SupplierFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof SupplierFormType>(field: K, value: SupplierFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function SupplierFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Nombre" error={errors.name} required>
          <InputInterface value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Persona de contacto">
          <InputInterface
            value={form.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Email" error={errors.email}>
          <InputInterface
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Teléfono">
          <InputInterface value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="CUIT">
          <InputInterface value={form.cuit} onChange={(e) => onChange("cuit", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.isActive ? "active" : "inactive"}
            onChange={(e) => onChange("isActive", e.target.value === "active")}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </SelectInterface>
        </FieldInterface>
      </div>

      <FieldInterface label="Dirección">
        <InputInterface
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Crear proveedor"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
