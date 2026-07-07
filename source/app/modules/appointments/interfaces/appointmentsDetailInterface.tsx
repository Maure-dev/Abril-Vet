import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONE,
  APPOINTMENT_TYPE_LABELS
} from "@app/modules/appointments/constants/constants";
import type { AppointmentType } from "@app/modules/appointments/entities/entities";
import { formatAppointmentDate } from "@app/modules/appointments/helpers/appointmentMappers";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { useSession } from "@app/modules/main/hooks/useSession";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";

type Props = {
  appointment: AppointmentType;
  onEdit: (appointment: AppointmentType) => void;
  onDelete: (appointment: AppointmentType) => void;
  onChangeVet: (appointment: AppointmentType, vetId: string) => void;
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

// Tipos de registro clínico que se pueden generar desde el turno (ruta del módulo destino).
const RECORD_TYPES = [
  { label: "Consulta", route: "/historia-clinica" },
  { label: "Vacuna", route: "/vacunacion" },
  { label: "Desparasitación", route: "/desparasitaciones" },
  { label: "Estudio", route: "/estudios" },
  { label: "Cirugía", route: "/cirugias" },
  { label: "Internación", route: "/internaciones" }
];

export default function AppointmentsDetailInterface({
  appointment,
  onEdit,
  onDelete,
  onChangeVet,
  onBack
}: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const { getLabel: getClientLabel } = useEntityLookup("clients");
  const { getLabel: getVetLabel } = useEntityLookup("vets");
  const { options: vetOptions, loading: vetsLoading } = useEntityOptions("vets");
  const patientLabel = getPatientLabel(appointment.patientId);
  const clientLabel = getClientLabel(appointment.clientId);
  const vetLabel = getVetLabel(appointment.vetId);
  // Si el veterinario asignado no está en la lista (p. ej. dado de baja), lo agrego como opción
  // para que el combo lo muestre en vez de saltar al primero.
  const vetInOptions = vetOptions.some((option) => option.id === appointment.vetId);
  const { navigate } = useRouter();
  const { hasRole } = useSession();
  const canRegister = hasRole(["admin", "vet", "assistant"]);

  // Abre el alta del módulo elegido con el paciente, el veterinario y la fecha del turno cargados,
  // y con `returnTo` para que al guardar/cancelar el registro vuelva a este turno.
  const registrar = (route: string): void => {
    const date = appointment.date.slice(0, 10);
    const returnTo = encodeURIComponent(`/agenda?id=${appointment.id}`);
    navigate(
      `${route}?patientId=${encodeURIComponent(appointment.patientId)}&vetId=${encodeURIComponent(appointment.vetId)}&date=${encodeURIComponent(date)}&returnTo=${returnTo}`
    );
  };

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
          <DeleteButtonInterface
            onConfirm={() => onDelete(appointment)}
            message="¿Seguro que querés eliminar este turno? Esta acción no se puede deshacer."
          />
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
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Veterinario</dt>
            <dd className="text-sm">
              <select
                aria-label="Reasignar veterinario"
                value={appointment.vetId}
                disabled={vetsLoading}
                onChange={(e) => onChangeVet(appointment, e.target.value)}
                className="rounded-buttons border border-line bg-surface px-2 py-1 text-sm font-medium text-ink transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default disabled:opacity-60"
              >
                <option value="">Sin asignar</option>
                {vetInOptions || !appointment.vetId ? null : (
                  <option value={appointment.vetId}>
                    {vetLabel || (vetsLoading ? "Cargando…" : "Veterinario dado de baja")}
                  </option>
                )}
                {vetOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </dd>
          </div>
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

      {canRegister ? (
        <CardInterface>
          <h3 className="mb-1 font-display text-base text-brand-fg">Registrar atención</h3>
          <p className="mb-3 text-sm text-ink-soft">
            Elegí qué registrar: se abre el formulario con el paciente y la fecha del turno
            cargados, y queda en la historia clínica del paciente.
          </p>
          <div className="flex flex-wrap gap-2">
            {RECORD_TYPES.map((type) => (
              <ButtonInterface
                key={type.route}
                variant="secondary"
                size="sm"
                onClick={() => registrar(type.route)}
              >
                {type.label}
              </ButtonInterface>
            ))}
          </div>
        </CardInterface>
      ) : null}
    </div>
  );
}
