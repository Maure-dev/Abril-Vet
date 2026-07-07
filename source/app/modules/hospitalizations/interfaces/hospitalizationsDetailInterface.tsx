import { STATUS_LABELS } from "@app/modules/hospitalizations/constants/constants";
import type { HospitalizationType } from "@app/modules/hospitalizations/entities/entities";
import { computeStayDays } from "@app/modules/hospitalizations/helpers/computeStayDays";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";

type Props = {
  hospitalization: HospitalizationType;
  onEdit: (hospitalization: HospitalizationType) => void;
  onDelete: (hospitalization: HospitalizationType) => void;
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

function Block({ label, value }: { label: string; value: string }) {
  return (
    <CardInterface>
      <h3 className="mb-2 font-display text-base text-brand-fg">{label}</h3>
      <p className="whitespace-pre-line text-sm text-ink">{value}</p>
    </CardInterface>
  );
}

export default function HospitalizationsDetailInterface({
  hospitalization,
  onEdit,
  onDelete,
  onBack
}: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const patientLabel = getPatientLabel(hospitalization.patientId);
  const days = computeStayDays(hospitalization.admissionDate, hospitalization.dischargeDate);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">Internación</h2>
        <BadgeInterface tone={hospitalization.status === "active" ? "info" : "success"}>
          {STATUS_LABELS[hospitalization.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(hospitalization)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(hospitalization)}
            message="¿Seguro que querés eliminar esta internación? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos generales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Paciente</dt>
            <dd className="text-sm">
              <EntityLinkInterface
                kind="patients"
                id={hospitalization.patientId}
                label={patientLabel}
              />
            </dd>
          </div>
          <Row label="Motivo" value={hospitalization.reason} />
          <Row label="Fecha de ingreso" value={hospitalization.admissionDate} />
          <Row label="Fecha de alta" value={hospitalization.dischargeDate} />
          <Row label="Días de internación" value={String(days)} />
        </dl>
      </CardInterface>

      {hospitalization.dailyNotes ? (
        <Block label="Evolución diaria" value={hospitalization.dailyNotes} />
      ) : null}
      {hospitalization.medication ? (
        <Block label="Medicación" value={hospitalization.medication} />
      ) : null}
      {hospitalization.feeding ? (
        <Block label="Alimentación" value={hospitalization.feeding} />
      ) : null}
      {hospitalization.controls ? (
        <Block label="Controles" value={hospitalization.controls} />
      ) : null}
      {hospitalization.notes ? <Block label="Observaciones" value={hospitalization.notes} /> : null}
    </div>
  );
}
