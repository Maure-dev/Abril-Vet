import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import FormActionsInterface from "@app/modules/main/interfaces/formActionsInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import {
  REMINDER_STATUS_LABELS,
  REMINDER_TYPE_LABELS
} from "@app/modules/reminders/constants/constants";
import type {
  ReminderFormErrorsType,
  ReminderFormType,
  ReminderStatusType,
  ReminderTypeType
} from "@app/modules/reminders/entities/entities";

type Props = {
  form: ReminderFormType;
  errors: ReminderFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof ReminderFormType>(field: K, value: ReminderFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const TYPE_OPTIONS = Object.keys(REMINDER_TYPE_LABELS) as ReminderTypeType[];
const STATUS_OPTIONS = Object.keys(REMINDER_STATUS_LABELS) as ReminderStatusType[];

export default function RemindersFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const { options: patientOptions, loading: patientsLoading } = useEntityOptions("patients");
  const { getLabel: getClientLabel } = useEntityLookup("clients");
  const clientLabel = getClientLabel(form.clientId);

  // El cliente (dueño) se toma de la mascota elegida: no se selecciona ni se edita a mano.
  const handlePatientChange = (id: string): void => {
    const option = patientOptions.find((patient) => patient.id === id);
    onChange("patientId", id);
    onChange("clientId", option?.clientId ?? "");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <EntitySelectInterface
          label="Paciente"
          value={form.patientId}
          onChange={handlePatientChange}
          options={patientOptions}
          loading={patientsLoading}
          error={errors.patientId}
          placeholder="Seleccioná el paciente"
          emptyHint="No hay pacientes cargados. Cargá uno en Pacientes."
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Cliente (dueño)</span>
          <div className="rounded-buttons border border-line bg-surface-muted px-3 py-2 text-sm text-ink-soft">
            {form.patientId ? clientLabel || "—" : "Se toma de la mascota seleccionada"}
          </div>
        </div>
        <FieldInterface label="Tipo">
          <SelectInterface
            value={form.type}
            onChange={(e) => onChange("type", e.target.value as ReminderTypeType)}
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {REMINDER_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Vencimiento" error={errors.dueDate} required>
          <InputInterface
            type="date"
            value={form.dueDate}
            onChange={(e) => onChange("dueDate", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as ReminderStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {REMINDER_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
      </div>

      <FieldInterface label="Mensaje" error={errors.message} required>
        <TextareaInterface
          rows={3}
          value={form.message}
          onChange={(e) => onChange("message", e.target.value)}
        />
      </FieldInterface>

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Crear recordatorio"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
