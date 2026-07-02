import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import { STUDY_STATUS_LABELS, STUDY_TYPE_LABELS } from "@app/modules/studies/constants/constants";
import type {
  StudyFormErrorsType,
  StudyFormType,
  StudyStatusType,
  StudyTypeType
} from "@app/modules/studies/entities/entities";

type Props = {
  form: StudyFormType;
  errors: StudyFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof StudyFormType>(field: K, value: StudyFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const TYPE_OPTIONS = Object.keys(STUDY_TYPE_LABELS) as StudyTypeType[];
const STATUS_OPTIONS = Object.keys(STUDY_STATUS_LABELS) as StudyStatusType[];

export default function StudiesFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const { options: patientOptions, loading: patientsLoading } = useEntityOptions("patients");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Nombre" error={errors.name} required>
          <InputInterface value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </FieldInterface>
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
        <FieldInterface label="Tipo">
          <SelectInterface
            value={form.type}
            onChange={(e) => onChange("type", e.target.value as StudyTypeType)}
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {STUDY_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as StudyStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STUDY_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Fecha" error={errors.date}>
          <InputInterface
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Solicitado por">
          <InputInterface
            value={form.requestedBy}
            onChange={(e) => onChange("requestedBy", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label="Resultado">
        <TextareaInterface
          rows={4}
          value={form.result}
          onChange={(e) => onChange("result", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear estudio"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
