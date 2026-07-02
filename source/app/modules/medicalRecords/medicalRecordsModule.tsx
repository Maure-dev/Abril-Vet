import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterMedicalRecords } from "@app/modules/medicalRecords/helpers/filterMedicalRecords";
import { sortRecordsByDateDesc } from "@app/modules/medicalRecords/helpers/sortRecordsByDateDesc";
import { useMedicalRecordsActions } from "@app/modules/medicalRecords/hooks/useMedicalRecordsActions";
import MedicalRecordsDetailInterface from "@app/modules/medicalRecords/interfaces/medicalRecordsDetailInterface";
import MedicalRecordsFormInterface from "@app/modules/medicalRecords/interfaces/medicalRecordsFormInterface";
import MedicalRecordsListInterface from "@app/modules/medicalRecords/interfaces/medicalRecordsListInterface";
import { useMedicalRecordsProvider } from "@app/modules/medicalRecords/states/medicalRecordsProvider";
import { useEffect } from "react";

export default function MedicalRecordsModule() {
  const { getMedicalRecordsState } = useMedicalRecordsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterPatient,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useMedicalRecordsActions();
  const state = getMedicalRecordsState;
  const visible = sortRecordsByDateDesc(
    filterMedicalRecords(state.items, state.query, state.patientFilter)
  );

  useDocumentHead({
    title: "Historia clínica",
    description: "Historia clínica electrónica de cada paciente."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Historia clínica"
        subtitle="Registros clínicos: motivo, diagnóstico, tratamiento y evolución."
      />

      {state.mode === "detail" && state.selected ? (
        <MedicalRecordsDetailInterface
          record={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <MedicalRecordsFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          onChange={handleChangeField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <MedicalRecordsListInterface
          items={visible}
          query={state.query}
          patientFilter={state.patientFilter}
          onSearch={handleSearch}
          onFilterPatient={handleFilterPatient}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
