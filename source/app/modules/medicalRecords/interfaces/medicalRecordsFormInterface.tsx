import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { InputInterface, TextareaInterface } from "@app/modules/main/interfaces/inputInterface";
import { SECTION_LABELS } from "@app/modules/medicalRecords/constants/constants";
import type {
  MedicalRecordFormErrorsType,
  MedicalRecordFormType
} from "@app/modules/medicalRecords/entities/entities";

type Props = {
  form: MedicalRecordFormType;
  errors: MedicalRecordFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof MedicalRecordFormType>(
    field: K,
    value: MedicalRecordFormType[K]
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function MedicalRecordsFormInterface({
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
        <FieldInterface label="Fecha de consulta" error={errors.date} required>
          <InputInterface
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Próximo control" error={errors.nextControlDate}>
          <InputInterface
            type="date"
            value={form.nextControlDate}
            onChange={(e) => onChange("nextControlDate", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label={SECTION_LABELS.reason} error={errors.reason} required>
        <InputInterface value={form.reason} onChange={(e) => onChange("reason", e.target.value)} />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.anamnesis}>
        <TextareaInterface
          rows={3}
          value={form.anamnesis}
          onChange={(e) => onChange("anamnesis", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.physicalExam}>
        <TextareaInterface
          rows={3}
          value={form.physicalExam}
          onChange={(e) => onChange("physicalExam", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.diagnosis}>
        <TextareaInterface
          rows={2}
          value={form.diagnosis}
          onChange={(e) => onChange("diagnosis", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.treatment}>
        <TextareaInterface
          rows={3}
          value={form.treatment}
          onChange={(e) => onChange("treatment", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.prescription}>
        <TextareaInterface
          rows={3}
          value={form.prescription}
          onChange={(e) => onChange("prescription", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.indications}>
        <TextareaInterface
          rows={2}
          value={form.indications}
          onChange={(e) => onChange("indications", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label={SECTION_LABELS.evolution}>
        <TextareaInterface
          rows={3}
          value={form.evolution}
          onChange={(e) => onChange("evolution", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear registro"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
