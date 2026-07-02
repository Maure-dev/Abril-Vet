import type { MedicalRecordType } from "@app/modules/medicalRecords/entities/entities";

// Función pura: devuelve una copia de los registros ordenada por fecha descendente
// (más recientes primero). Como las fechas son ISO (yyyy-mm-dd), la comparación
// lexicográfica de strings equivale a la cronológica. No muta el arreglo original.
export function sortRecordsByDateDesc(items: MedicalRecordType[]): MedicalRecordType[] {
  return [...items].sort((a, b) => {
    if (a.date === b.date) {
      return 0;
    }
    return a.date > b.date ? -1 : 1;
  });
}
