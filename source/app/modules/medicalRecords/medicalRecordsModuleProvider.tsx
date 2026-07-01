import MedicalRecordsProvider from "@app/modules/medicalRecords/states/medicalRecordsProvider";
import MedicalRecordsModule from "./medicalRecordsModule";

export default function MedicalRecordsModuleProvider() {
  return (
    <MedicalRecordsProvider>
      <MedicalRecordsModule />
    </MedicalRecordsProvider>
  );
}
