import type { MedicalRecordsDataType } from "@app/modules/medicalRecords/entities/entities";

export const INITIAL_STATE = {
  MEDICAL_RECORDS_PAGE: {
    items: [],
    loading: false
  } satisfies MedicalRecordsDataType
};
