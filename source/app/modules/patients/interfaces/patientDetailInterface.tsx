import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import {
  REPRODUCTIVE_LABELS,
  SEX_LABELS,
  SPECIES_LABELS
} from "@app/modules/patients/constants/constants";
import type { PatientType } from "@app/modules/patients/entities/entities";
import { computeAge } from "@app/modules/patients/helpers/computeAge";

type Props = {
  patient: PatientType;
  onEdit: (patient: PatientType) => void;
  onDelete: (patient: PatientType) => void;
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

export default function PatientDetailInterface({ patient, onEdit, onDelete, onBack }: Props) {
  const age = computeAge(patient.birthDate);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          ← Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{patient.name}</h2>
        <BadgeInterface tone="brand">{SPECIES_LABELS[patient.species]}</BadgeInterface>
        {!patient.isActive ? <BadgeInterface tone="neutral">Inactivo</BadgeInterface> : null}
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(patient)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(patient)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos generales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Raza" value={patient.breed} />
          <Row label="Sexo" value={SEX_LABELS[patient.sex]} />
          <Row
            label="Estado reproductivo"
            value={REPRODUCTIVE_LABELS[patient.reproductiveStatus]}
          />
          <Row label="Edad" value={age} />
          <Row label="Peso" value={patient.weightKg === null ? "" : `${patient.weightKg} kg`} />
          <Row label="Color" value={patient.color} />
          <Row label="Microchip" value={patient.microchip} />
          <Row label="N° de identificación" value={patient.identificationNumber} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Salud</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Alergias" value={patient.allergies} />
          <Row label="Enfermedades preexistentes" value={patient.preexistingConditions} />
          <Row label="Medicación habitual" value={patient.habitualMedication} />
        </dl>
      </CardInterface>

      {patient.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{patient.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
