import { STATUS_LABELS, STATUS_TONES } from "@app/modules/dewormings/constants/constants";
import type { DewormingType } from "@app/modules/dewormings/entities/entities";
import { computeDewormingStatus } from "@app/modules/dewormings/helpers/computeDewormingStatus";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";

type Props = {
  deworming: DewormingType;
  onEdit: (deworming: DewormingType) => void;
  onDelete: (deworming: DewormingType) => void;
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

export default function DewormingDetailInterface({ deworming, onEdit, onDelete, onBack }: Props) {
  const status = computeDewormingStatus(deworming.nextDoseDate);
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const { getLabel: getVetLabel } = useEntityLookup("vets");
  const patientLabel = getPatientLabel(deworming.patientId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{deworming.productName}</h2>
        <BadgeInterface tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(deworming)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(deworming)}
            message="¿Seguro que querés eliminar esta desparasitación? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de la desparasitación</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Paciente</dt>
            <dd className="text-sm">
              <EntityLinkInterface kind="patients" id={deworming.patientId} label={patientLabel} />
            </dd>
          </div>
          <Row label="Antiparasitario" value={deworming.productName} />
          <Row label="Fecha de aplicación" value={deworming.date} />
          <Row label="Próxima dosis" value={deworming.nextDoseDate} />
          <Row label="Peso (kg)" value={deworming.weightKg} />
          <Row label="Veterinario" value={getVetLabel(deworming.vetId)} />
        </dl>
      </CardInterface>

      {deworming.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{deworming.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
