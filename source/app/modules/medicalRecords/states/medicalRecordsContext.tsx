import type { MedicalRecordsContextType } from "@app/modules/medicalRecords/entities/entities";
import { createContext } from "react";

export const MedicalRecordsContext = createContext<MedicalRecordsContextType | null>(null);
