import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterStudies } from "@app/modules/studies/helpers/filterStudies";
import { useStudiesActions } from "@app/modules/studies/hooks/useStudiesActions";
import StudiesDetailInterface from "@app/modules/studies/interfaces/studiesDetailInterface";
import StudiesFormInterface from "@app/modules/studies/interfaces/studiesFormInterface";
import StudiesListInterface from "@app/modules/studies/interfaces/studiesListInterface";
import { useStudiesProvider } from "@app/modules/studies/states/studiesProvider";
import { useEffect } from "react";

export default function StudiesModule() {
  const { getStudiesState } = useStudiesProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterType,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useStudiesActions();
  const state = getStudiesState;
  const byType = filterStudies(state.items, state.query, state.typeFilter);
  const visible =
    state.statusFilter === "all"
      ? byType
      : byType.filter((study) => study.status === state.statusFilter);

  useDocumentHead({
    title: "Estudios",
    description: "Laboratorio, ecografías, radiografías y otros estudios de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Estudios"
        subtitle="Laboratorio, ecografías, radiografías y otros estudios de los pacientes."
      />

      {state.mode === "detail" && state.selected ? (
        <StudiesDetailInterface
          study={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <StudiesFormInterface
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
        <StudiesListInterface
          items={visible}
          query={state.query}
          typeFilter={state.typeFilter}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterType={handleFilterType}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
