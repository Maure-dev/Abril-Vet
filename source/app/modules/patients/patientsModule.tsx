import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterPatients } from "@app/modules/patients/helpers/filterPatients";
import { usePatientsActions } from "@app/modules/patients/hooks/usePatientsActions";
import PatientDetailInterface from "@app/modules/patients/interfaces/patientDetailInterface";
import PatientFormInterface from "@app/modules/patients/interfaces/patientFormInterface";
import PatientsListInterface from "@app/modules/patients/interfaces/patientsListInterface";
import { usePatientsProvider } from "@app/modules/patients/states/patientsProvider";
import { useEffect } from "react";

export default function PatientsModule() {
  const { getPatientsState } = usePatientsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterSpecies,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = usePatientsActions();
  const state = getPatientsState;
  const visible = filterPatients(state.items, state.query, state.speciesFilter);
  const { navigate, pathname, searchParams } = useRouter();
  const openId = searchParams.get("id");

  useDocumentHead({
    title: "Pacientes",
    description: "Fichas clínicas de las mascotas de la veterinaria."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-link ?id=: al llegar desde otra ficha, abre el detalle de esa mascota y limpia la URL.
  useEffect(() => {
    if (!openId || state.loading) {
      return;
    }
    const item = state.items.find((p) => p.id === openId);
    if (item) {
      handleOpenDetail(item);
      navigate(pathname, { replace: true });
    }
  }, [openId, state.loading]);

  return (
    <section>
      <PageHeaderInterface
        title="Pacientes"
        subtitle="Fichas clínicas de las mascotas y sus datos de salud."
      />

      {state.mode === "detail" && state.selected ? (
        <PatientDetailInterface
          patient={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <PatientFormInterface
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
        <PatientsListInterface
          items={visible}
          query={state.query}
          speciesFilter={state.speciesFilter}
          onSearch={handleSearch}
          onFilterSpecies={handleFilterSpecies}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
