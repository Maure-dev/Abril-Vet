import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Historia clinica. Este es un tipo base de ejemplo.
export type MedicalRecordsItemType = {
  id: string;
  name: string;
};

export type MedicalRecordsDataType = {
  items: MedicalRecordsItemType[];
  loading: boolean;
};

export type MedicalRecordsContextType = {
  getMedicalRecordsState: MedicalRecordsDataType;
  setMedicalRecordsState: Dispatch<SetStateAction<MedicalRecordsDataType>>;
};
