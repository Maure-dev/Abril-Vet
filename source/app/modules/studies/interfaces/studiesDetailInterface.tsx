import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft, Paperclip } from "@app/modules/main/interfaces/icons";
import { STUDY_STATUS_LABELS, STUDY_TYPE_LABELS } from "@app/modules/studies/constants/constants";
import type { StudyStatusType, StudyType } from "@app/modules/studies/entities/entities";

type Props = {
  study: StudyType;
  onEdit: (study: StudyType) => void;
  onDelete: (study: StudyType) => void;
  onBack: () => void;
};

const STATUS_TONE: Record<StudyStatusType, "neutral" | "info" | "success"> = {
  requested: "neutral",
  in_progress: "info",
  completed: "success"
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function StudiesDetailInterface({ study, onEdit, onDelete, onBack }: Props) {
  const { getLabel } = useEntityLookup("patients");
  const { getLabel: getVetLabel } = useEntityLookup("vets");
  const patientLabel = getLabel(study.patientId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{study.name}</h2>
        <BadgeInterface tone="brand">{STUDY_TYPE_LABELS[study.type]}</BadgeInterface>
        <BadgeInterface tone={STATUS_TONE[study.status]}>
          {STUDY_STATUS_LABELS[study.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(study)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(study)}
            message="¿Seguro que querés eliminar este estudio? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos generales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Paciente</dt>
            <dd className="text-sm">
              <EntityLinkInterface kind="patients" id={study.patientId} label={patientLabel} />
            </dd>
          </div>
          <Row label="Tipo" value={STUDY_TYPE_LABELS[study.type]} />
          <Row label="Estado" value={STUDY_STATUS_LABELS[study.status]} />
          <Row label="Fecha" value={study.date ?? ""} />
          <Row label="Solicitado por" value={getVetLabel(study.requestedBy)} />
        </dl>
      </CardInterface>

      {study.result ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Resultado</h3>
          <p className="whitespace-pre-line text-sm text-ink">{study.result}</p>
        </CardInterface>
      ) : null}

      {study.attachments.length > 0 ? (
        <CardInterface>
          <h3 className="mb-4 font-display text-base text-brand-fg">Adjuntos</h3>
          <ul className="flex flex-col gap-2">
            {study.attachments.map((attachment) => (
              <li key={attachment.url}>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand-fg hover:underline"
                >
                  <Paperclip className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  {attachment.name}
                </a>
              </li>
            ))}
          </ul>
        </CardInterface>
      ) : null}
    </div>
  );
}
