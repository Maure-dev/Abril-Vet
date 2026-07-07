import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft, Paperclip } from "@app/modules/main/interfaces/icons";
import { SECTION_LABELS } from "@app/modules/medicalRecords/constants/constants";
import type { MedicalRecordType } from "@app/modules/medicalRecords/entities/entities";

type Props = {
  record: MedicalRecordType;
  onEdit: (record: MedicalRecordType) => void;
  onDelete: (record: MedicalRecordType) => void;
  onBack: () => void;
};

// Sección clínica: sólo se muestra si tiene contenido.
function Section({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-display text-base text-brand-fg">{label}</h3>
      <p className="whitespace-pre-line text-sm text-ink">{value}</p>
    </div>
  );
}

export default function MedicalRecordsDetailInterface({ record, onEdit, onDelete, onBack }: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const { getLabel: getVetLabel } = useEntityLookup("vets");
  const patientLabel = getPatientLabel(record.patientId);
  const vetLabel = getVetLabel(record.vetId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">Consulta del {record.date || "—"}</h2>
        <BadgeInterface tone="brand">Paciente: {patientLabel || "—"}</BadgeInterface>
        {record.nextControlDate ? (
          <BadgeInterface tone="info">Próximo control {record.nextControlDate}</BadgeInterface>
        ) : null}
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(record)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(record)}
            message="¿Seguro que querés eliminar esta consulta? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de la consulta</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Fecha</dt>
            <dd className="text-sm text-ink">{record.date || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Paciente</dt>
            <dd className="text-sm">
              <EntityLinkInterface kind="patients" id={record.patientId} label={patientLabel} />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Veterinario</dt>
            <dd className="text-sm text-ink">{vetLabel || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Próximo control</dt>
            <dd className="text-sm text-ink">{record.nextControlDate || "—"}</dd>
          </div>
        </dl>
      </CardInterface>

      <CardInterface>
        <div className="flex flex-col gap-5">
          <Section label={SECTION_LABELS.reason} value={record.reason} />
          <Section label={SECTION_LABELS.anamnesis} value={record.anamnesis} />
          <Section label={SECTION_LABELS.physicalExam} value={record.physicalExam} />
          <Section label={SECTION_LABELS.diagnosis} value={record.diagnosis} />
          <Section label={SECTION_LABELS.treatment} value={record.treatment} />
          <Section label={SECTION_LABELS.prescription} value={record.prescription} />
          <Section label={SECTION_LABELS.indications} value={record.indications} />
          <Section label={SECTION_LABELS.evolution} value={record.evolution} />
        </div>
      </CardInterface>

      {record.attachments && record.attachments.length > 0 ? (
        <CardInterface>
          <h3 className="mb-4 font-display text-base text-brand-fg">Adjuntos</h3>
          <ul className="flex flex-col gap-2">
            {record.attachments.map((attachment) => (
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
