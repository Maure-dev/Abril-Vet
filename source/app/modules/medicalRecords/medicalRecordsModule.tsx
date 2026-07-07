import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterMedicalRecords } from "@app/modules/medicalRecords/helpers/filterMedicalRecords";
import { sortRecordsByDateDesc } from "@app/modules/medicalRecords/helpers/sortRecordsByDateDesc";
import { useMedicalRecordsActions } from "@app/modules/medicalRecords/hooks/useMedicalRecordsActions";
import MedicalRecordsDetailInterface from "@app/modules/medicalRecords/interfaces/medicalRecordsDetailInterface";
import MedicalRecordsFormInterface from "@app/modules/medicalRecords/interfaces/medicalRecordsFormInterface";
import MedicalRecordsListInterface from "@app/modules/medicalRecords/interfaces/medicalRecordsListInterface";
import { useMedicalRecordsProvider } from "@app/modules/medicalRecords/states/medicalRecordsProvider";
import { useEffect, useRef } from "react";

export default function MedicalRecordsModule() {
  const { getMedicalRecordsState } = useMedicalRecordsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterPatient,
    handleOpenCreate,
    handleOpenCreatePrefilled,
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
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");
  const openPatientId = searchParams.get("patientId");
  const openVetId = searchParams.get("vetId");
  const openDate = searchParams.get("date");
  const handledParamsRef = useRef<string | null>(null);
  const returnToRef = useRef<string | null>(null);
  const prevModeRef = useRef(state.mode);

  useDocumentHead({
    title: "Historia clínica",
    description: "Historia clínica electrónica de cada paciente."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-link por URL: ?id= abre el detalle del registro; ?patientId=&vetId=&date= abre el alta
  // precargada (lo dispara "Registrar atención" desde un turno). Corre una sola vez por navegación
  // y limpia la URL para no reprocesarla.
  useEffect(() => {
    if (state.loading || (!openId && !openPatientId)) {
      return;
    }
    const paramsKey = `${openId ?? ""}|${openPatientId ?? ""}|${openVetId ?? ""}|${openDate ?? ""}`;
    if (handledParamsRef.current === paramsKey) {
      return;
    }
    handledParamsRef.current = paramsKey;
    if (openId) {
      const item = state.items.find((r) => r.id === openId);
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

  // Al cerrar el detalle/alta (guardar, cancelar o volver), si llegamos con "returnTo" volvemos
  // al origen (un turno de la agenda o la ficha de un paciente). Se dispara cuando el modo pasa
  // de detail/create/edit a list.
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
