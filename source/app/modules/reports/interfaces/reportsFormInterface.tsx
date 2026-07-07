import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import { TONE_LABELS } from "@app/modules/reports/constants/constants";
import type {
  MetricToneType,
  ReportsFormErrorsType,
  ReportsFormType
} from "@app/modules/reports/entities/entities";

type Props = {
  form: ReportsFormType;
  errors: ReportsFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof ReportsFormType>(field: K, value: ReportsFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const TONE_OPTIONS = Object.keys(TONE_LABELS) as MetricToneType[];

export default function ReportsFormInterface({
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
        <FieldInterface label="Nombre del reporte" error={errors.label} required>
          <InputInterface value={form.label} onChange={(e) => onChange("label", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Tono">
          <SelectInterface
            value={form.tone}
            onChange={(e) => onChange("tone", e.target.value as MetricToneType)}
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone} value={tone}>
                {TONE_LABELS[tone]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Desde" error={errors.fromDate}>
          <InputInterface
            type="date"
            value={form.fromDate}
            onChange={(e) => onChange("fromDate", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Hasta" error={errors.toDate}>
          <InputInterface
            type="date"
            value={form.toDate}
            onChange={(e) => onChange("toDate", e.target.value)}
          />
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
        submitLabel={isEdit ? "Guardar cambios" : "Crear reporte"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
