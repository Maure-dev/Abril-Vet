import { filterHospitalizations } from "@app/modules/hospitalizations/helpers/filterHospitalizations";
import { useHospitalizationsActions } from "@app/modules/hospitalizations/hooks/useHospitalizationsActions";
import HospitalizationsDetailInterface from "@app/modules/hospitalizations/interfaces/hospitalizationsDetailInterface";
import HospitalizationsFormInterface from "@app/modules/hospitalizations/interfaces/hospitalizationsFormInterface";
import HospitalizationsListInterface from "@app/modules/hospitalizations/interfaces/hospitalizationsListInterface";
import { useHospitalizationsProvider } from "@app/modules/hospitalizations/states/hospitalizationsProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function HospitalizationsModule() {
  const { getHospitalizationsState } = useHospitalizationsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useHospitalizationsActions();
  const state = getHospitalizationsState;
  const visible = filterHospitalizations(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Internaciones",
    description: "Pacientes internados y su evolución diaria."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Internaciones"
        subtitle="Pacientes internados, su evolución diaria y controles."
      />

      {state.mode === "detail" && state.selected ? (
        <HospitalizationsDetailInterface
          hospitalization={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <HospitalizationsFormInterface
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
        <HospitalizationsListInterface
          items={visible}
          query={state.query}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
