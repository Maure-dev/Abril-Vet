import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { useSession } from "@app/modules/main/hooks/useSession";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import CertificateButtonInterface from "@app/modules/main/interfaces/certificateButtonInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import {
  REPRODUCTIVE_LABELS,
  SEX_LABELS,
  SPECIES_LABELS
} from "@app/modules/patients/constants/constants";
import type { PatientHistoryItemType, PatientType } from "@app/modules/patients/entities/entities";
import { computeAge } from "@app/modules/patients/helpers/computeAge";
import { fetchPatientHistory } from "@app/modules/patients/services/services";
import { useEffect, useState } from "react";

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
  const { getLabel } = useEntityLookup("clients");
  const ownerLabel = getLabel(patient.clientId);
  const { hasRole } = useSession();
  const { navigate } = useRouter();
  const canSeeClinical = hasRole(["admin", "vet", "assistant"]);
  const [history, setHistory] = useState<PatientHistoryItemType[]>([]);

  useEffect(() => {
    if (!canSeeClinical) {
      return;
    }
    let active = true;
    fetchPatientHistory(patient.id)
      .then((items) => {
        if (active) {
          setHistory(items);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [patient.id, canSeeClinical]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          ← Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{patient.name}</h2>
        <BadgeInterface tone="brand">{SPECIES_LABELS[patient.species]}</BadgeInterface>
        {!patient.isActive ? <BadgeInterface tone="neutral">Inactivo</BadgeInterface> : null}
        <div className="ml-auto flex flex-wrap gap-2">
          <CertificateButtonInterface
            label="Certificado de salud"
            data={{
              title: "Certificado de buena salud",
              subtitle: `Paciente: ${patient.name}`,
              rows: [
                { label: "Paciente", value: patient.name },
                { label: "Especie", value: SPECIES_LABELS[patient.species] },
                { label: "Raza", value: patient.breed || "—" },
                { label: "Sexo", value: SEX_LABELS[patient.sex] },
                { label: "Microchip", value: patient.microchip || "—" },
                { label: "Dueño", value: ownerLabel || "—" }
              ],
              note: "Se certifica que el paciente arriba detallado se encuentra clínicamente sano a la fecha de emisión."
            }}
          />
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(patient)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(patient)}
            message="¿Seguro que querés eliminar este paciente? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      {patient.photoUrl ? (
        <img
          src={patient.photoUrl}
          alt={`Foto de ${patient.name}`}
          className="h-48 w-auto max-w-full rounded-card border border-line object-cover"
        />
      ) : null}

      <CardInterface>
        <h3 className="mb-2 font-display text-base text-brand-fg">Dueño</h3>
        <EntityLinkInterface
          kind="clients"
          id={patient.clientId}
          label={ownerLabel}
          fallback="Sin dueño asignado"
        />
      </CardInterface>

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

      {canSeeClinical ? (
        <CardInterface>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-display text-base text-brand-fg">Historia clínica</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-ink-soft">Sin registros clínicos todavía.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {history.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `${item.route}?id=${encodeURIComponent(item.id)}&returnTo=${encodeURIComponent(`/pacientes?id=${patient.id}`)}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-buttons border border-line bg-surface px-3 py-2 text-left text-sm hover:bg-surface-muted"
                  >
                    <span className="w-24 shrink-0 text-xs text-ink-soft">{item.date || "—"}</span>
                    <BadgeInterface tone="brand">{item.kindLabel}</BadgeInterface>
                    <span className="flex-1 truncate text-ink">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardInterface>
      ) : null}

      {patient.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{patient.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
