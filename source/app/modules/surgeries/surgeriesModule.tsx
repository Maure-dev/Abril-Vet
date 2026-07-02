import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterSurgeries } from "@app/modules/surgeries/helpers/filterSurgeries";
import { useSurgeriesActions } from "@app/modules/surgeries/hooks/useSurgeriesActions";
import SurgeriesDetailInterface from "@app/modules/surgeries/interfaces/surgeriesDetailInterface";
import SurgeriesFormInterface from "@app/modules/surgeries/interfaces/surgeriesFormInterface";
import SurgeriesListInterface from "@app/modules/surgeries/interfaces/surgeriesListInterface";
import { useSurgeriesProvider } from "@app/modules/surgeries/states/surgeriesProvider";
import { useEffect } from "react";

export default function SurgeriesModule() {
  const { getSurgeriesState } = useSurgeriesProvider();
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
  } = useSurgeriesActions();
  const state = getSurgeriesState;
  const visible = filterSurgeries(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Cirugías",
    description: "Cirugías, ayudantes, medicación y evolución de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Cirugías"
        subtitle="Programación y seguimiento clínico de las cirugías."
      />

      {state.mode === "detail" && state.selected ? (
        <SurgeriesDetailInterface
          surgery={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <SurgeriesFormInterface
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
        <SurgeriesListInterface
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
