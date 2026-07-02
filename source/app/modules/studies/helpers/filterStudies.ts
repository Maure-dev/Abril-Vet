import type { StudyType, StudyTypeFilterType } from "@app/modules/studies/entities/entities";

// Función pura: filtra estudios por texto (nombre) y por tipo. Case-insensitive.
export function filterStudies(
  items: StudyType[],
  query: string,
  typeFilter: StudyTypeFilterType
): StudyType[] {
  const q = query.trim().toLowerCase();
  return items.filter((study) => {
    if (typeFilter !== "all" && study.type !== typeFilter) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return study.name.toLowerCase().includes(q);
  });
}
