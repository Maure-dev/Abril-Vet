import type {
  CashRegisterFormErrorsType,
  CashRegisterFormType
} from "@app/modules/cashRegister/entities/entities";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import { InputInterface, TextareaInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  form: CashRegisterFormType;
  errors: CashRegisterFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof CashRegisterFormType>(
    field: K,
    value: CashRegisterFormType[K]
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function CashRegisterFormInterface({
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
        <FieldInterface
          label="Monto de apertura (ARS)"
          error={errors.openingAmount}
          hint="Efectivo inicial en la caja"
          required
        >
          <InputInterface
            type="number"
            step="0.01"
            min="0"
            value={form.openingAmount}
            disabled={isEdit}
            onChange={(e) => onChange("openingAmount", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label="Notas" error={errors.notes}>
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Abrir caja"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
