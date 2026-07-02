import type {
  MedicalRecordFormType,
  MedicalRecordInputType,
  MedicalRecordType
} from "@app/modules/medicalRecords/entities/entities";

// Formulario → datos persistibles.
export function toMedicalRecordInput(form: MedicalRecordFormType): MedicalRecordInputType {
  return {
    patientId: form.patientId.trim(),
    vetId: form.vetId.trim(),
    date: form.date.trim(),
    reason: form.reason.trim(),
    anamnesis: form.anamnesis.trim(),
    physicalExam: form.physicalExam.trim(),
    diagnosis: form.diagnosis.trim(),
    treatment: form.treatment.trim(),
    prescription: form.prescription.trim(),
    indications: form.indications.trim(),
    evolution: form.evolution.trim(),
    nextControlDate: form.nextControlDate.trim()
  };
}

// Registro existente → formulario (para edición).
export function formFromMedicalRecord(record: MedicalRecordType): MedicalRecordFormType {
  return {
    patientId: record.patientId,
    vetId: record.vetId,
    date: record.date,
    reason: record.reason,
    anamnesis: record.anamnesis,
    physicalExam: record.physicalExam,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    prescription: record.prescription,
    indications: record.indications,
    evolution: record.evolution,
    nextControlDate: record.nextControlDate
  };
}
