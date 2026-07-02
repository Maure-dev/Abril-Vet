import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { STATUS_LABELS, STATUS_TONES } from "@app/modules/vaccinations/constants/constants";
import type { VaccinationType } from "@app/modules/vaccinations/entities/entities";
import { computeVaccineStatus } from "@app/modules/vaccinations/helpers/computeVaccineStatus";

type Props = {
  vaccination: VaccinationType;
  onEdit: (vaccination: VaccinationType) => void;
  onDelete: (vaccination: VaccinationType) => void;
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

export default function VaccinationsDetailInterface({
  vaccination,
  onEdit,
  onDelete,
  onBack
}: Props) {
  const status = computeVaccineStatus(vaccination.nextDoseDate);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{vaccination.vaccineName}</h2>
        <BadgeInterface tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(vaccination)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(vaccination)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de la vacunación</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Paciente" value={vaccination.patientId} />
          <Row label="Vacuna" value={vaccination.vaccineName} />
          <Row label="Fecha de aplicación" value={vaccination.date} />
          <Row label="Próxima dosis" value={vaccination.nextDoseDate} />
          <Row label="Lote" value={vaccination.batch} />
          <Row label="Veterinario" value={vaccination.vetId} />
        </dl>
      </CardInterface>

      {vaccination.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{vaccination.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
