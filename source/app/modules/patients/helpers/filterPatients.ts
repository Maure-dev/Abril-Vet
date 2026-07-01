import type { PatientType, SpeciesFilterType } from "@app/modules/patients/entities/entities";

// Función pura: filtra pacientes por texto (nombre, raza, microchip, identificación)
// y por especie. Case-insensitive.
export function filterPatients(
  items: PatientType[],
  query: string,
  speciesFilter: SpeciesFilterType
): PatientType[] {
  const q = query.trim().toLowerCase();
  return items.filter((p) => {
    if (speciesFilter !== "all" && p.species !== speciesFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [p.name, p.breed, p.microchip, p.identificationNumber].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
