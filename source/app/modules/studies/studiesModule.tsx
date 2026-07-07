import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterStudies } from "@app/modules/studies/helpers/filterStudies";
import { useStudiesActions } from "@app/modules/studies/hooks/useStudiesActions";
import StudiesDetailInterface from "@app/modules/studies/interfaces/studiesDetailInterface";
import StudiesFormInterface from "@app/modules/studies/interfaces/studiesFormInterface";
import StudiesListInterface from "@app/modules/studies/interfaces/studiesListInterface";
import { useStudiesProvider } from "@app/modules/studies/states/studiesProvider";
import { useEffect, useRef } from "react";

export default function StudiesModule() {
  const { getStudiesState } = useStudiesProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterType,
    handleFilterStatus,
    handleQuickStatus,
    handleOpenCreate,
    handleOpenCreatePrefilled,
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
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");
  const openPatientId = searchParams.get("patientId");
  const openVetId = searchParams.get("vetId");
  const openDate = searchParams.get("date");
  const returnToRef = useRef<string | null>(null);
  const prevModeRef = useRef(state.mode);

  useDocumentHead({
    title: "Estudios",
    description: "Laboratorio, ecografías, radiografías y otros estudios de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-link por URL (una sola vez por navegación: al procesarla se limpia la URL):
  // ?id= abre el detalle de ese estudio; ?patientId=&vetId=&date= abre el alta precargada
  // (esto dispara "Registrar atención" desde un turno; este módulo ignora vetId).
  useEffect(() => {
    if (state.loading) {
      return;
    }
    if (openId) {
      const item = state.items.find((study) => study.id === openId);
      if (item) {
        handleOpenDetail(item);
        returnToRef.current = searchParams.get("returnTo");
        navigate(pathname, { replace: true });
      }
      return;
    }
    if (openPatientId) {
      handleOpenCreatePrefilled({
        patientId: openPatientId,
        vetId: openVetId ?? "",
        date: openDate ?? ""
      });
      returnToRef.current = searchParams.get("returnTo");
      navigate(pathname, { replace: true });
    }
  }, [openId, openPatientId, openVetId, openDate, state.loading]);

  // Al cerrar el detalle/alta (guardar, cancelar o volver), si se llegó con "returnTo"
  // se regresa al origen (un turno de la agenda o la ficha de un paciente).
  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = state.mode;
    if (returnToRef.current && prev !== "list" && state.mode === "list") {
      const dest = returnToRef.current;
      returnToRef.current = null;
      navigate(dest);
    }
  }, [state.mode]);

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
          onQuickStatus={handleQuickStatus}
        />
      ) : null}
    </section>
  );
}
