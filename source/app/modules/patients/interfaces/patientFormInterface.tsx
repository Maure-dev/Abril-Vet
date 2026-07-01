import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import {
  REPRODUCTIVE_LABELS,
  SEX_LABELS,
  SPECIES_LABELS
} from "@app/modules/patients/constants/constants";
import type {
  PatientFormErrorsType,
  PatientFormType,
  ReproductiveStatusType,
  SexType,
  SpeciesType
} from "@app/modules/patients/entities/entities";

type Props = {
  form: PatientFormType;
  errors: PatientFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof PatientFormType>(field: K, value: PatientFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const SPECIES_OPTIONS = Object.keys(SPECIES_LABELS) as SpeciesType[];
const SEX_OPTIONS = Object.keys(SEX_LABELS) as SexType[];
const REPRODUCTIVE_OPTIONS = Object.keys(REPRODUCTIVE_LABELS) as ReproductiveStatusType[];

export default function PatientFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Nombre" error={errors.name} required>
          <InputInterface value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </FieldInterface>
        <FieldInterface
          label="Cliente (ID)"
          error={errors.clientId}
          hint="Referencia al dueño del paciente"
          required
        >
          <InputInterface
            value={form.clientId}
            onChange={(e) => onChange("clientId", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Especie">
          <SelectInterface
            value={form.species}
            onChange={(e) => onChange("species", e.target.value as SpeciesType)}
          >
            {SPECIES_OPTIONS.map((species) => (
              <option key={species} value={species}>
                {SPECIES_LABELS[species]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Raza">
          <InputInterface value={form.breed} onChange={(e) => onChange("breed", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Sexo">
          <SelectInterface
            value={form.sex}
            onChange={(e) => onChange("sex", e.target.value as SexType)}
          >
            {SEX_OPTIONS.map((sex) => (
              <option key={sex} value={sex}>
                {SEX_LABELS[sex]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Estado reproductivo">
          <SelectInterface
            value={form.reproductiveStatus}
            onChange={(e) =>
              onChange("reproductiveStatus", e.target.value as ReproductiveStatusType)
            }
          >
            {REPRODUCTIVE_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {REPRODUCTIVE_LABELS[status]}
              </option>
            ))}
          </SelectInterface>
        </FieldInterface>
        <FieldInterface label="Fecha de nacimiento" error={errors.birthDate}>
          <InputInterface
            type="date"
            value={form.birthDate}
            onChange={(e) => onChange("birthDate", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Peso (kg)" error={errors.weightKg}>
          <InputInterface
            type="number"
            step="0.01"
            min="0"
            value={form.weightKg}
            onChange={(e) => onChange("weightKg", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Color">
          <InputInterface value={form.color} onChange={(e) => onChange("color", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Microchip">
          <InputInterface
            value={form.microchip}
            onChange={(e) => onChange("microchip", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="N° de identificación">
          <InputInterface
            value={form.identificationNumber}
            onChange={(e) => onChange("identificationNumber", e.target.value)}
          />
        </FieldInterface>
      </div>

      <FieldInterface label="Alergias">
        <TextareaInterface
          rows={2}
          value={form.allergies}
          onChange={(e) => onChange("allergies", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Enfermedades preexistentes">
        <TextareaInterface
          rows={2}
          value={form.preexistingConditions}
          onChange={(e) => onChange("preexistingConditions", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Medicación habitual">
        <TextareaInterface
          rows={2}
          value={form.habitualMedication}
          onChange={(e) => onChange("habitualMedication", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Observaciones generales">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear paciente"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
