import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONE,
  APPOINTMENT_TYPE_LABELS
} from "@app/modules/appointments/constants/constants";
import type { AppointmentType } from "@app/modules/appointments/entities/entities";
import { formatAppointmentDate } from "@app/modules/appointments/helpers/appointmentMappers";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";

type Props = {
  appointment: AppointmentType;
  onEdit: (appointment: AppointmentType) => void;
  onDelete: (appointment: AppointmentType) => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function AppointmentsDetailInterface({
  appointment,
  onEdit,
  onDelete,
  onBack
}: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const { getLabel: getClientLabel } = useEntityLookup("clients");
  const { getLabel: getVetLabel } = useEntityLookup("vets");
  const patientLabel = getPatientLabel(appointment.patientId);
  const clientLabel = getClientLabel(appointment.clientId);
  const vetLabel = getVetLabel(appointment.vetId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          ← Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{formatAppointmentDate(appointment.date)}</h2>
        <BadgeInterface tone="brand">{APPOINTMENT_TYPE_LABELS[appointment.type]}</BadgeInterface>
        <BadgeInterface tone={APPOINTMENT_STATUS_TONE[appointment.status]}>
          {APPOINTMENT_STATUS_LABELS[appointment.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(appointment)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(appointment)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos del turno</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Fecha y hora" value={formatAppointmentDate(appointment.date)} />
          <Row label="Duración" value={`${appointment.durationMin} min`} />
          <Row label="Tipo" value={APPOINTMENT_TYPE_LABELS[appointment.type]} />
          <Row label="Estado" value={APPOINTMENT_STATUS_LABELS[appointment.status]} />
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Paciente</dt>
            <dd className="text-sm">
              <EntityLinkInterface
                kind="patients"
                id={appointment.patientId}
                label={patientLabel}
              />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Cliente (dueño)</dt>
            <dd className="text-sm">
              <EntityLinkInterface kind="clients" id={appointment.clientId} label={clientLabel} />
            </dd>
          </div>
          <Row label="Veterinario" value={vetLabel} />
        </dl>
      </CardInterface>

      {appointment.reason ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Motivo</h3>
          <p className="whitespace-pre-line text-sm text-ink">{appointment.reason}</p>
        </CardInterface>
      ) : null}

      {appointment.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{appointment.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
