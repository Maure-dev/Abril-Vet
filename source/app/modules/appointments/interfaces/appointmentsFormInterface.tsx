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
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
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
  const { options: vetOptions, loading: vetsLoading } = useEntityOptions("vets");
  const { getLabel: getClientLabel } = useEntityLookup("clients");
  const clientLabel = getClientLabel(form.clientId);

  // El cliente (dueño) se toma de la mascota elegida: no se selecciona ni se edita a mano.
  const handlePatientChange = (id: string): void => {
    const option = patientOptions.find((patient) => patient.id === id);
    onChange("patientId", id);
    onChange("clientId", option?.clientId ?? "");
  };

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
          onChange={handlePatientChange}
          options={patientOptions}
          loading={patientsLoading}
          error={errors.patientId}
          required
          placeholder="Seleccioná el paciente"
          emptyHint="No hay pacientes cargados. Cargá uno en Pacientes."
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Cliente (dueño)</span>
          <div className="rounded-buttons border border-line bg-surface-muted px-3 py-2 text-sm text-ink-soft">
            {form.patientId ? clientLabel || "—" : "Se toma de la mascota seleccionada"}
          </div>
        </div>
        <EntitySelectInterface
          label="Veterinario"
          value={form.vetId}
          onChange={(id) => onChange("vetId", id)}
          options={vetOptions}
          loading={vetsLoading}
          error={errors.vetId}
          placeholder="Seleccioná el veterinario"
          emptyHint="No hay veterinarios cargados. Cargá uno en Personal."
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
