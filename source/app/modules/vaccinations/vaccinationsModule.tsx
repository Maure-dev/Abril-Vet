import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterVaccinations } from "@app/modules/vaccinations/helpers/filterVaccinations";
import { useVaccinationsActions } from "@app/modules/vaccinations/hooks/useVaccinationsActions";
import VaccinationsDetailInterface from "@app/modules/vaccinations/interfaces/vaccinationsDetailInterface";
import VaccinationsFormInterface from "@app/modules/vaccinations/interfaces/vaccinationsFormInterface";
import VaccinationsListInterface from "@app/modules/vaccinations/interfaces/vaccinationsListInterface";
import { useVaccinationsProvider } from "@app/modules/vaccinations/states/vaccinationsProvider";
import { useEffect, useRef } from "react";

export default function VaccinationsModule() {
  const { getVaccinationsState } = useVaccinationsProvider();
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
  } = useVaccinationsActions();
  const state = getVaccinationsState;
  const visible = filterVaccinations(state.items, state.query, state.statusFilter);
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");
  const openPatientId = searchParams.get("patientId");
  const openVetId = searchParams.get("vetId");
  const openDate = searchParams.get("date");
  const returnToRef = useRef<string | null>(null);
  const prevModeRef = useRef(state.mode);

  useDocumentHead({
    title: "Vacunación",
    description: "Calendario y control de vacunas de los pacientes."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-links por URL: abre el detalle (?id=) o el alta precargada (?patientId=&vetId=&date=)
  // y limpia la URL para que el efecto no vuelva a dispararse en la misma navegación.
  useEffect(() => {
    if (state.loading) {
      return;
    }
    if (openId) {
      const item = state.items.find((v) => v.id === openId);
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

  // Al cerrar el detalle/formulario (guardar, cancelar o volver) regresa al origen
  // (turno de la agenda o ficha del paciente) capturado en "returnTo", si existe.
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
