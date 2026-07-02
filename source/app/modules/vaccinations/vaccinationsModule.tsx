import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterVaccinations } from "@app/modules/vaccinations/helpers/filterVaccinations";
import { useVaccinationsActions } from "@app/modules/vaccinations/hooks/useVaccinationsActions";
import VaccinationsDetailInterface from "@app/modules/vaccinations/interfaces/vaccinationsDetailInterface";
import VaccinationsFormInterface from "@app/modules/vaccinations/interfaces/vaccinationsFormInterface";
import VaccinationsListInterface from "@app/modules/vaccinations/interfaces/vaccinationsListInterface";
import { useVaccinationsProvider } from "@app/modules/vaccinations/states/vaccinationsProvider";
import { useEffect } from "react";

export default function VaccinationsModule() {
  const { getVaccinationsState } = useVaccinationsProvider();
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
  } = useVaccinationsActions();
  const state = getVaccinationsState;
  const visible = filterVaccinations(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Vacunación",
    description: "Calendario y control de vacunas de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Vacunación"
        subtitle="Registro de vacunas aplicadas, próximas dosis y vencimientos."
      />

      {state.mode === "detail" && state.selected ? (
        <VaccinationsDetailInterface
          vaccination={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <VaccinationsFormInterface
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
        <VaccinationsListInterface
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
