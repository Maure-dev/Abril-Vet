import type { ClientFormErrorsType, ClientFormType } from "@app/modules/clients/entities/entities";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";

type Props = {
  form: ClientFormType;
  errors: ClientFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof ClientFormType>(field: K, value: ClientFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function ClientsFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Nombre" error={errors.firstName} required>
          <InputInterface
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Apellido" error={errors.lastName} required>
          <InputInterface
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Documento (DNI/CUIT)">
          <InputInterface value={form.docId} onChange={(e) => onChange("docId", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Email" error={errors.email}>
          <InputInterface
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Teléfono" error={errors.phone} required>
          <InputInterface value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="WhatsApp">
          <InputInterface
            value={form.whatsapp}
            onChange={(e) => onChange("whatsapp", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Dirección">
          <InputInterface
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Ciudad">
          <InputInterface value={form.city} onChange={(e) => onChange("city", e.target.value)} />
        </FieldInterface>
        <FieldInterface
          label="Saldo (ARS)"
          error={errors.balance}
          hint="Saldo de cuenta corriente en pesos (entero)"
        >
          <InputInterface
            type="number"
            step="1"
            value={form.balance}
            onChange={(e) => onChange("balance", e.target.value)}
          />
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

      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear cliente"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
