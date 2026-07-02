import { STATUS_LABELS } from "@app/modules/hospitalizations/constants/constants";
import type {
  HospitalizationFormErrorsType,
  HospitalizationFormType,
  HospitalizationStatusType
} from "@app/modules/hospitalizations/entities/entities";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";

type Props = {
  form: HospitalizationFormType;
  errors: HospitalizationFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof HospitalizationFormType>(
    field: K,
    value: HospitalizationFormType[K]
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as HospitalizationStatusType[];

export default function HospitalizationsFormInterface({
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
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as HospitalizationStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Fecha de ingreso" error={errors.admissionDate} required>
          <InputInterface
            type="date"
            value={form.admissionDate}
            onChange={(e) => onChange("admissionDate", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Fecha de alta" error={errors.dischargeDate}>
          <InputInterface
            type="date"
            value={form.dischargeDate}
            onChange={(e) => onChange("dischargeDate", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label="Motivo" error={errors.reason} required>
        <InputInterface value={form.reason} onChange={(e) => onChange("reason", e.target.value)} />
      </FieldInterface>

      <FieldInterface label="Evolución diaria">
        <TextareaInterface
          rows={3}
          value={form.dailyNotes}
          onChange={(e) => onChange("dailyNotes", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Medicación">
        <TextareaInterface
          rows={2}
          value={form.medication}
          onChange={(e) => onChange("medication", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Alimentación">
        <TextareaInterface
          rows={2}
          value={form.feeding}
          onChange={(e) => onChange("feeding", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Controles">
        <TextareaInterface
          rows={2}
          value={form.controls}
          onChange={(e) => onChange("controls", e.target.value)}
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
          {isEdit ? "Guardar cambios" : "Crear internación"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
