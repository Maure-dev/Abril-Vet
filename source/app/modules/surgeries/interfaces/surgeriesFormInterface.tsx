import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import { SURGERY_STATUS_LABELS } from "@app/modules/surgeries/constants/constants";
import type {
  SurgeryFormErrorsType,
  SurgeryFormType,
  SurgeryStatusType
} from "@app/modules/surgeries/entities/entities";

type Props = {
  form: SurgeryFormType;
  errors: SurgeryFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof SurgeryFormType>(field: K, value: SurgeryFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const STATUS_OPTIONS = Object.keys(SURGERY_STATUS_LABELS) as SurgeryStatusType[];

export default function SurgeriesFormInterface({
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
        <FieldInterface label="Tipo de cirugía" error={errors.type} required>
          <InputInterface value={form.type} onChange={(e) => onChange("type", e.target.value)} />
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
            onChange={(e) => onChange("status", e.target.value as SurgeryStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {SURGERY_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
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
        <FieldInterface label="Ayudantes">
          <InputInterface
            value={form.assistants}
            onChange={(e) => onChange("assistants", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label="Diagnóstico">
        <TextareaInterface
          rows={2}
          value={form.diagnosis}
          onChange={(e) => onChange("diagnosis", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Medicación">
        <TextareaInterface
          rows={2}
          value={form.medication}
          onChange={(e) => onChange("medication", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Evolución">
        <TextareaInterface
          rows={2}
          value={form.evolution}
          onChange={(e) => onChange("evolution", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Observaciones generales">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear cirugía"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
