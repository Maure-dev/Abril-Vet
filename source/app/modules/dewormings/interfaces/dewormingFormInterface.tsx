import type {
  DewormingFormErrorsType,
  DewormingFormType
} from "@app/modules/dewormings/entities/entities";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import { InputInterface, TextareaInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  form: DewormingFormType;
  errors: DewormingFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof DewormingFormType>(field: K, value: DewormingFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function DewormingFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const { options: patientOptions, loading: patientsLoading } = useEntityOptions("patients");
  const { options: vetOptions, loading: vetsLoading } = useEntityOptions("vets");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <EntitySelectInterface
          label="Paciente"
          value={form.patientId}
          onChange={(id) => onChange("patientId", id)}
          options={patientOptions}
          loading={patientsLoading}
          error={errors.patientId}
          required
          placeholder="Seleccioná el paciente"
          emptyHint="No hay pacientes cargados. Cargá uno en Pacientes."
        />
        <FieldInterface label="Antiparasitario" error={errors.productName} required>
          <InputInterface
            value={form.productName}
            onChange={(e) => onChange("productName", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Fecha de aplicación" error={errors.date} required>
          <InputInterface
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface
          label="Próxima dosis"
          error={errors.nextDoseDate}
          hint="Dejá vacío si no requiere refuerzo"
        >
          <InputInterface
            type="date"
            value={form.nextDoseDate}
            onChange={(e) => onChange("nextDoseDate", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Peso (kg)">
          <InputInterface
            value={form.weightKg}
            onChange={(e) => onChange("weightKg", e.target.value)}
          />
        </FieldInterface>
        <EntitySelectInterface
          label="Veterinario"
          value={form.vetId}
          onChange={(id) => onChange("vetId", id)}
          options={vetOptions}
          loading={vetsLoading}
          error={errors.vetId}
          placeholder="Seleccioná el veterinario"
          emptyHint="No hay veterinarios cargados. Cargá uno en Veterinarios."
        />
      </div>

      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Registrar desparasitación"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
