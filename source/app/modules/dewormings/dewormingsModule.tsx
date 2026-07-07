import { filterDewormings } from "@app/modules/dewormings/helpers/filterDewormings";
import { useDewormingsActions } from "@app/modules/dewormings/hooks/useDewormingsActions";
import DewormingDetailInterface from "@app/modules/dewormings/interfaces/dewormingDetailInterface";
import DewormingFormInterface from "@app/modules/dewormings/interfaces/dewormingFormInterface";
import DewormingsListInterface from "@app/modules/dewormings/interfaces/dewormingsListInterface";
import { useDewormingsProvider } from "@app/modules/dewormings/states/dewormingsProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect, useRef } from "react";

export default function DewormingsModule() {
  const { getDewormingsState } = useDewormingsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenCreatePrefilled,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useDewormingsActions();
  const state = getDewormingsState;
  const visible = filterDewormings(state.items, state.query, state.statusFilter);
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");
  const openPatientId = searchParams.get("patientId");
  const openVetId = searchParams.get("vetId");
  const openDate = searchParams.get("date");
  const returnToRef = useRef<string | null>(null);
  const prevModeRef = useRef(state.mode);

  useDocumentHead({
    title: "Desparasitación",
    description: "Calendario y control de desparasitaciones de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-link: ?id= abre el detalle del registro; ?patientId (+ vetId, date) abre el alta
  // precargada (lo que dispara "Registrar atención" desde un turno). Limpia la URL al abrir.
  useEffect(() => {
    if (state.loading) {
      return;
    }
    if (openId) {
      const item = state.items.find((d) => d.id === openId);
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

  // Al cerrar el formulario/detalle (guardar, cancelar o volver) regresa al origen (turno o
  // ficha del paciente) desde el que se llegó vía "returnTo", si fue capturado.
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
        title="Desparasitación"
        subtitle="Registro de antiparasitarios aplicados, próximas dosis y vencimientos."
      />

      {state.mode === "detail" && state.selected ? (
        <DewormingDetailInterface
          deworming={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <DewormingFormInterface
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
        <DewormingsListInterface
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
