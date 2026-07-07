import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
  DURATION_OPTIONS
} from "@app/modules/appointments/constants/constants";
import type {
  AppointmentFormErrorsType,
  AppointmentFormType,
  AppointmentStatusType,
  AppointmentType,
  AppointmentTypeType
} from "@app/modules/appointments/entities/entities";
import { availableTimeSlots } from "@app/modules/appointments/helpers/availableTimeSlots";
import { todayStr } from "@app/modules/main/helpers/weekDates";
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

type Props = {
  form: AppointmentFormType;
  errors: AppointmentFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  items: AppointmentType[];
  excludeId: string;
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
  items,
  excludeId,
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

  // La fecha y la hora se cargan por separado pero se guardan en un único campo (yyyy-mm-ddThh:mm).
  const dateOnly = form.date.slice(0, 10);
  const time = form.date.length >= 16 ? form.date.slice(11, 16) : "";
  const durationNum = Number(form.durationMin);
  const durationValid = !Number.isNaN(durationNum) && durationNum > 0;

  // El combo de horario se habilita recién con fecha y duración: la duración define el largo del
  // turno y con eso se calculan los slots libres. El veterinario es opcional (se puede agendar sin
  // asignarlo); si hay veterinario, además se descartan los horarios que se pisan con su agenda.
  const timeReady = durationValid && Boolean(dateOnly);
  const slots = timeReady
    ? availableTimeSlots({
        date: dateOnly,
        durationMin: durationNum,
        vetId: form.vetId,
        items: items,
        excludeId: excludeId,
        now: new Date()
      })
    : [];
  // En edición, el horario ya cargado se mantiene visible aunque no aparezca entre los slots.
  const timeOptions = time && !slots.includes(time) ? [time, ...slots] : slots;

  const timeHint = !dateOnly
    ? "Elegí primero la fecha."
    : !durationValid
      ? "Elegí primero la duración."
      : slots.length === 0
        ? "No hay horarios disponibles para ese día."
        : form.vetId
          ? ""
          : "Sin veterinario asignado: no se controla la superposición de turnos.";

  // El error de fecha/hora va al campo que corresponde: si ya hay fecha pero falta el horario,
  // se muestra bajo "Horario"; si no, bajo "Fecha".
  const missingTime = Boolean(dateOnly) && !time;
  const dateError = missingTime ? undefined : errors.date;
  const timeError = missingTime ? errors.date : undefined;

  const handleDateChange = (value: string): void => {
    onChange("date", value ? (time ? `${value}T${time}` : value) : "");
  };

  const handleTimeChange = (value: string): void => {
    onChange("date", value ? `${dateOnly}T${value}` : dateOnly);
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
          label="Veterinario (opcional)"
          value={form.vetId}
          onChange={(id) => onChange("vetId", id)}
          options={vetOptions}
          loading={vetsLoading}
          error={errors.vetId}
          placeholder="Sin asignar"
          emptyHint="No hay veterinarios cargados. Cargá uno en Personal."
          clearable
        />
        <FieldInterface label="Duración" error={errors.durationMin}>
          <SelectInterface
            value={form.durationMin}
            onChange={(e) => onChange("durationMin", e.target.value)}
          >
            {DURATION_OPTIONS.map((duration) => (
              <option key={duration} value={duration}>
                {duration} min
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Fecha" error={dateError} required>
          <InputInterface
            type="date"
            min={todayStr()}
            value={dateOnly}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Horario" error={timeError} hint={timeHint} required>
          <SelectInterface
            value={time}
            disabled={!timeReady || slots.length === 0}
            onChange={(e) => handleTimeChange(e.target.value)}
          >
            <option value="">
              {timeReady ? "Seleccioná el horario" : "Elegí la fecha y la duración"}
            </option>
            {timeOptions.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </SelectInterface>
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

      <FormActionsInterface
        submitLabel={isEdit ? "Guardar cambios" : "Crear turno"}
        onSubmit={onSubmit}
        onCancel={onCancel}
        saving={saving}
      />
    </form>
  );
}
