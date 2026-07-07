import { filterHospitalizations } from "@app/modules/hospitalizations/helpers/filterHospitalizations";
import { useHospitalizationsActions } from "@app/modules/hospitalizations/hooks/useHospitalizationsActions";
import HospitalizationsDetailInterface from "@app/modules/hospitalizations/interfaces/hospitalizationsDetailInterface";
import HospitalizationsFormInterface from "@app/modules/hospitalizations/interfaces/hospitalizationsFormInterface";
import HospitalizationsListInterface from "@app/modules/hospitalizations/interfaces/hospitalizationsListInterface";
import { useHospitalizationsProvider } from "@app/modules/hospitalizations/states/hospitalizationsProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect, useRef } from "react";

export default function HospitalizationsModule() {
  const { getHospitalizationsState } = useHospitalizationsProvider();
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
  } = useHospitalizationsActions();
  const state = getHospitalizationsState;
  const visible = filterHospitalizations(state.items, state.query, state.statusFilter);
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");
  const prefillPatientId = searchParams.get("patientId");
  const prefillVetId = searchParams.get("vetId");
  const prefillDate = searchParams.get("date");
  const handledSearchRef = useRef<string | null>(null);
  const returnToRef = useRef<string | null>(null);
  const prevModeRef = useRef(state.mode);

  useDocumentHead({
    title: "Internaciones",
    description: "Pacientes internados y su evolución diaria."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-links por query params (una sola vez por navegación, cuando ya cargaron las internaciones):
  // ?id= abre la ficha; ?patientId=&vetId=&date= abre el alta precargada ("Registrar atención").
  useEffect(() => {
    if (state.loading) {
      return;
    }
    const search = searchParams.toString();
    if (handledSearchRef.current === search) {
      return;
    }
    if (openId) {
      const item = state.items.find((h) => h.id === openId);
      if (item) {
        handledSearchRef.current = search;
        handleOpenDetail(item);
        returnToRef.current = searchParams.get("returnTo");
        navigate(pathname, { replace: true });
      }
      return;
    }
    if (prefillPatientId) {
      handledSearchRef.current = search;
      handleOpenCreatePrefilled({
        patientId: prefillPatientId,
        vetId: prefillVetId ?? "",
        date: prefillDate ?? ""
      });
      returnToRef.current = searchParams.get("returnTo");
      navigate(pathname, { replace: true });
    }
  }, [openId, prefillPatientId, prefillVetId, prefillDate, state.loading]);

  // Al cerrar el detalle/formulario (guardar, cancelar o volver), si se llegó con "returnTo",
  // se regresa al origen (turno de la agenda o ficha del paciente).
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
          onQuickStatus={handleQuickStatus}
        />
      ) : null}
    </section>
  );
}
