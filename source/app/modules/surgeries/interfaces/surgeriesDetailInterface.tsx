import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { SURGERY_STATUS_LABELS } from "@app/modules/surgeries/constants/constants";
import type { SurgeryStatusType, SurgeryType } from "@app/modules/surgeries/entities/entities";

type Props = {
  surgery: SurgeryType;
  onEdit: (surgery: SurgeryType) => void;
  onDelete: (surgery: SurgeryType) => void;
  onBack: () => void;
};

// Tono de la pastilla según el estado de la cirugía.
const STATUS_TONE: Record<SurgeryStatusType, "info" | "success" | "error"> = {
  scheduled: "info",
  done: "success",
  cancelled: "error"
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function SurgeriesDetailInterface({ surgery, onEdit, onDelete, onBack }: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const { getLabel: getVetLabel } = useEntityLookup("vets");
  const patientLabel = getPatientLabel(surgery.patientId);
  const vetLabel = getVetLabel(surgery.vetId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{surgery.type || "Cirugía"}</h2>
        <BadgeInterface tone={STATUS_TONE[surgery.status]}>
          {SURGERY_STATUS_LABELS[surgery.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(surgery)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(surgery)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos generales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Fecha" value={surgery.date} />
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Paciente</dt>
            <dd className="text-sm">
              <EntityLinkInterface kind="patients" id={surgery.patientId} label={patientLabel} />
            </dd>
          </div>
          <Row label="Veterinario" value={vetLabel} />
          <Row label="Ayudantes" value={surgery.assistants} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Evolución clínica</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Diagnóstico" value={surgery.diagnosis} />
          <Row label="Medicación" value={surgery.medication} />
          <Row label="Evolución" value={surgery.evolution} />
        </dl>
      </CardInterface>

      {surgery.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{surgery.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
