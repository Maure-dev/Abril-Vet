import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS
} from "@app/modules/appointments/constants/constants";
import type {
  AppointmentFormErrorsType,
  AppointmentFormType,
  AppointmentStatusType,
  AppointmentTypeType
} from "@app/modules/appointments/entities/entities";
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
  form: AppointmentFormType;
  errors: AppointmentFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof AppointmentFormType>(field: K, value: AppointmentFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const TYPE_OPTIONS = Object.keys(APPOINTMENT_TYPE_LABELS) as AppointmentTypeType[];
const STATUS_OPTIONS = Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatusType[];

export default function AppointmentsFormInterface({
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
          label="Cliente"
          value={form.clientId}
          onChange={(id) => onChange("clientId", id)}
          options={clientOptions}
          loading={clientsLoading}
          error={errors.clientId}
          placeholder="Seleccioná el cliente"
          emptyHint="No hay clientes cargados. Creá uno en Clientes."
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
        <FieldInterface label="Fecha y hora" error={errors.date} required>
          <InputInterface
            type="datetime-local"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Duración (min)" error={errors.durationMin}>
          <InputInterface
            type="number"
            step="5"
            min="0"
            value={form.durationMin}
            onChange={(e) => onChange("durationMin", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Tipo">
          <SelectInterface
            value={form.type}
            onChange={(e) => onChange("type", e.target.value as AppointmentTypeType)}
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {APPOINTMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Estado">
          <SelectInterface
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as AppointmentStatusType)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {APPOINTMENT_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
      </div>

      <FieldInterface label="Motivo">
        <TextareaInterface
          rows={2}
          value={form.reason}
          onChange={(e) => onChange("reason", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear turno"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
