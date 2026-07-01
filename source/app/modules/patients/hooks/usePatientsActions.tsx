import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/patients/constants/constants";
import type {
  PatientFormType,
  PatientType,
  SpeciesFilterType
} from "@app/modules/patients/entities/entities";
import { formFromPatient, toPatientInput } from "@app/modules/patients/helpers/patientMappers";
import { validatePatientForm } from "@app/modules/patients/helpers/validatePatientForm";
import {
  createPatient,
  deletePatient,
  fetchPatients,
  updatePatient
} from "@app/modules/patients/services/services";
import { usePatientsProvider } from "@app/modules/patients/states/patientsProvider";

export const usePatientsActions = () => {
  const { getPatientsState, setPatientsState } = usePatientsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de pacientes.
  const handleLoad = async (): Promise<void> => {
    setPatientsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchPatients();
      setPatientsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los pacientes.");
      setPatientsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setPatientsState((s) => ({ ...s, query: query }));
  };

  const handleFilterSpecies = (speciesFilter: SpeciesFilterType): void => {
    setPatientsState((s) => ({ ...s, speciesFilter: speciesFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setPatientsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el paciente.
  const handleOpenEdit = (patient: PatientType): void => {
    setPatientsState((s) => ({
      ...s,
      mode: "edit",
      selected: patient,
      form: formFromPatient(patient),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del paciente.
  const handleOpenDetail = (patient: PatientType): void => {
    setPatientsState((s) => ({ ...s, mode: "detail", selected: patient }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setPatientsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof PatientFormType>(
    field: K,
    value: PatientFormType[K]
  ): void => {
    setPatientsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getPatientsState;
    const errors = validatePatientForm(form);
    if (Object.keys(errors).length > 0) {
      setPatientsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setPatientsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updatePatient(
          selected.id,
          toPatientInput(form, { photoUrl: selected.photoUrl, isActive: selected.isActive })
        );
        onNotification(true, "Paciente actualizado.");
      } else {
        await createPatient(toPatientInput(form));
        onNotification(true, "Paciente creado.");
      }
      setPatientsState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar el paciente. Probá de nuevo.");
      setPatientsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un paciente.
  const handleDelete = async (patient: PatientType): Promise<void> => {
    try {
      await deletePatient(patient.id);
      onNotification(true, "Paciente eliminado.");
      setPatientsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el paciente.");
    }
  };

  return {
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
  };
};
