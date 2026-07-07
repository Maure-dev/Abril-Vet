import type {
  DashAppointmentType,
  DashHospitalizationType
} from "@app/modules/dashboard/entities/entities";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import type { LucideIcon } from "@app/modules/main/interfaces/icons";
import { Bed, Calendar, Clock } from "@app/modules/main/interfaces/icons";
import type { ReactNode } from "react";

type Props = {
  loading: boolean;
  todayAppointments: DashAppointmentType[];
  upcomingAppointments: DashAppointmentType[];
  hospitalized: DashHospitalizationType[];
};

const time = (iso: string): string => (iso.length >= 16 ? iso.slice(11, 16) : "");
const day = (iso: string): string => iso.slice(0, 10);

function PanelCard({
  title,
  icon: Icon,
  loading,
  isEmpty,
  emptyText,
  children
}: {
  title: string;
  icon: LucideIcon;
  loading: boolean;
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  return (
    <CardInterface>
      <h2 className="mb-3 flex items-center gap-2 font-display text-base text-brand-fg">
        <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
        {title}
      </h2>
      {loading ? (
        <p className="text-sm text-ink-soft">Cargando…</p>
      ) : isEmpty ? (
        <p className="text-sm text-ink-soft">{emptyText}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line/60">{children}</ul>
      )}
    </CardInterface>
  );
}

function Row({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="min-w-0 truncate">{left}</span>
      {right ? <span className="shrink-0 text-xs text-ink-soft">{right}</span> : null}
    </li>
  );
}

// Paneles resumen del panel de inicio, con datos reales y links a la ficha del paciente.
export default function DashboardPanelsInterface({
  loading,
  todayAppointments,
  upcomingAppointments,
  hospitalized
}: Props) {
  const { getLabel } = useEntityLookup("patients");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PanelCard
        title="Agenda del día"
        icon={Calendar}
        loading={loading}
        isEmpty={todayAppointments.length === 0}
        emptyText="No hay turnos para hoy."
      >
        {todayAppointments.map((a) => (
          <Row
            key={a.id}
            left={
              <EntityLinkInterface kind="patients" id={a.patientId} label={getLabel(a.patientId)} />
            }
            right={time(a.date)}
          />
        ))}
      </PanelCard>

      <PanelCard
        title="Próximos turnos"
        icon={Clock}
        loading={loading}
        isEmpty={upcomingAppointments.length === 0}
        emptyText="No hay turnos próximos."
      >
        {upcomingAppointments.map((a) => (
          <Row
            key={a.id}
            left={
              <EntityLinkInterface kind="patients" id={a.patientId} label={getLabel(a.patientId)} />
            }
            right={`${day(a.date)} ${time(a.date)}`}
          />
        ))}
      </PanelCard>

      <PanelCard
        title="Pacientes internados"
        icon={Bed}
        loading={loading}
        isEmpty={hospitalized.length === 0}
        emptyText="No hay pacientes internados."
      >
        {hospitalized.map((h) => (
          <Row
            key={h.id}
            left={
              <EntityLinkInterface kind="patients" id={h.patientId} label={getLabel(h.patientId)} />
            }
            right={h.reason}
          />
        ))}
      </PanelCard>
    </div>
  );
}
