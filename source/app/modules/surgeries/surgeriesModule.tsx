import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterSurgeries } from "@app/modules/surgeries/helpers/filterSurgeries";
import { useSurgeriesActions } from "@app/modules/surgeries/hooks/useSurgeriesActions";
import SurgeriesDetailInterface from "@app/modules/surgeries/interfaces/surgeriesDetailInterface";
import SurgeriesFormInterface from "@app/modules/surgeries/interfaces/surgeriesFormInterface";
import SurgeriesListInterface from "@app/modules/surgeries/interfaces/surgeriesListInterface";
import { useSurgeriesProvider } from "@app/modules/surgeries/states/surgeriesProvider";
import { useEffect, useRef } from "react";

export default function SurgeriesModule() {
  const { getSurgeriesState } = useSurgeriesProvider();
  const {
    handleLoad,
    handleSearch,
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
  } = useSurgeriesActions();
  const state = getSurgeriesState;
  const visible = filterSurgeries(state.items, state.query, state.statusFilter);
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");
  const prefillPatientId = searchParams.get("patientId");
  const prefillVetId = searchParams.get("vetId");
  const prefillDate = searchParams.get("date");
  // Guard: procesa cada deep-link una sola vez por navegación.
  const handledDeepLink = useRef("");
  // Origen desde donde se llegó (turno/paciente): al cerrar el registro se vuelve ahí.
  const returnToRef = useRef<string | null>(null);
  const prevModeRef = useRef(state.mode);

  useDocumentHead({
    title: "Cirugías",
    description: "Cirugías, ayudantes, medicación y evolución de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-link por URL: ?id= abre el detalle; ?patientId&vetId&date abre el alta precargada.
  useEffect(() => {
    if (state.loading) {
      return;
    }
    const key = `${openId ?? ""}|${prefillPatientId ?? ""}|${prefillVetId ?? ""}|${prefillDate ?? ""}`;
    if (key === "|||" || handledDeepLink.current === key) {
      return;
    }
    if (openId) {
      const item = state.items.find((s) => s.id === openId);
      if (item) {
        handledDeepLink.current = key;
        handleOpenDetail(item);
        returnToRef.current = searchParams.get("returnTo");
        navigate(pathname, { replace: true });
      }
      return;
    }
    if (prefillPatientId) {
      handledDeepLink.current = key;
      handleOpenCreatePrefilled({
        patientId: prefillPatientId,
        vetId: prefillVetId ?? "",
        date: prefillDate ?? ""
      });
      returnToRef.current = searchParams.get("returnTo");
      navigate(pathname, { replace: true });
    }
  }, [openId, prefillPatientId, prefillVetId, prefillDate, state.loading]);

  // Al cerrar el registro (guardar, cancelar o volver del detalle) se vuelve al origen.
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
          onQuickStatus={handleQuickStatus}
        />
      ) : null}
    </section>
  );
}
