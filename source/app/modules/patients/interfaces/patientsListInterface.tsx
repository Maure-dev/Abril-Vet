import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { SPECIES_LABELS } from "@app/modules/patients/constants/constants";
import type {
  PatientType,
  SpeciesFilterType,
  SpeciesType
} from "@app/modules/patients/entities/entities";
import { PawPrint, Pencil } from "lucide-react";

type Props = {
  items: PatientType[];
  query: string;
  speciesFilter: SpeciesFilterType;
  onSearch: (query: string) => void;
  onFilterSpecies: (species: SpeciesFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (patient: PatientType) => void;
  onOpenEdit: (patient: PatientType) => void;
};

const SPECIES_OPTIONS = Object.keys(SPECIES_LABELS) as SpeciesType[];

export default function PatientsListInterface({
  items,
  query,
  speciesFilter,
  onSearch,
  onFilterSpecies,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por nombre, raza o microchip..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={speciesFilter}
          onChange={(e) => onFilterSpecies(e.target.value as SpeciesFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todas las especies</option>
          {SPECIES_OPTIONS.map((species) => (
            <option key={species} value={species}>
              {SPECIES_LABELS[species]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo paciente</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={PawPrint}
          title="No hay pacientes para mostrar"
          description="Cargá el primer paciente o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo paciente</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Especie</th>
                <th className="px-4 py-3 font-semibold">Raza</th>
                <th className="px-4 py-3 font-semibold">Microchip</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((patient) => (
                <tr
                  key={patient.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(patient)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{patient.name}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone="brand">{SPECIES_LABELS[patient.species]}</BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{patient.breed || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{patient.microchip || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${patient.name}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(patient);
                      }}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
