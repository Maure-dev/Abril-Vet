import type { MedicalRecordType } from "@app/modules/medicalRecords/entities/entities";

// Función pura: filtra registros por texto (motivo, diagnóstico) y por paciente
// (patientId exacto, sin distinguir mayúsculas). Case-insensitive.
export function filterMedicalRecords(
  items: MedicalRecordType[],
  query: string,
  patientFilter: string
): MedicalRecordType[] {
  const q = query.trim().toLowerCase();
  const patient = patientFilter.trim().toLowerCase();
  return items.filter((r) => {
    if (patient.length > 0 && r.patientId.toLowerCase() !== patient) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const haystack = [r.reason, r.diagnosis].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
