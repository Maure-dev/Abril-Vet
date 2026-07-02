import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { InputInterface, TextareaInterface } from "@app/modules/main/interfaces/inputInterface";
import type {
  VaccinationFormErrorsType,
  VaccinationFormType
} from "@app/modules/vaccinations/entities/entities";

type Props = {
  form: VaccinationFormType;
  errors: VaccinationFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof VaccinationFormType>(field: K, value: VaccinationFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function VaccinationsFormInterface({
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
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
        <FieldInterface label="Vacuna" error={errors.vaccineName} required>
          <InputInterface
            value={form.vaccineName}
            onChange={(e) => onChange("vaccineName", e.target.value)}
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
        <FieldInterface label="Lote">
          <InputInterface value={form.batch} onChange={(e) => onChange("batch", e.target.value)} />
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

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Registrar vacunación"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
