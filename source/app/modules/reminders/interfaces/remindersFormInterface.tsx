import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EntitySelectInterface from "@app/modules/main/interfaces/entitySelectInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import {
  REMINDER_CHANNEL_LABELS,
  REMINDER_STATUS_LABELS,
  REMINDER_TYPE_LABELS
} from "@app/modules/reminders/constants/constants";
import type {
  ReminderChannelType,
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
const CHANNEL_OPTIONS = Object.keys(REMINDER_CHANNEL_LABELS) as ReminderChannelType[];
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
  const { options: clientOptions, loading: clientsLoading } = useEntityOptions("clients");

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
          placeholder="Seleccioná el paciente"
          emptyHint="No hay pacientes cargados. Cargá uno en Pacientes."
        />
        <EntitySelectInterface
          label="Cliente"
          value={form.clientId}
          onChange={(id) => onChange("clientId", id)}
          options={clientOptions}
          loading={clientsLoading}
          error={errors.clientId}
          placeholder="Seleccioná el cliente"
          emptyHint="No hay clientes cargados. Creá uno en Clientes."
        />
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
        <FieldInterface label="Canal">
          <SelectInterface
            value={form.channel}
            onChange={(e) => onChange("channel", e.target.value as ReminderChannelType)}
          >
            {CHANNEL_OPTIONS.map((channel) => (
              <option key={channel} value={channel}>
                {REMINDER_CHANNEL_LABELS[channel]}
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

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear recordatorio"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
