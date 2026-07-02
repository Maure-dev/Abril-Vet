import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/vaccinations/constants/constants";
import type {
  VaccinationFormType,
  VaccinationType,
  VaccineStatusFilterType
} from "@app/modules/vaccinations/entities/entities";
import {
  formFromVaccination,
  toVaccinationInput
} from "@app/modules/vaccinations/helpers/vaccinationMappers";
import { validateVaccinationForm } from "@app/modules/vaccinations/helpers/validateVaccinationForm";
import {
  createVaccination,
  deleteVaccination,
  fetchVaccinations,
  updateVaccination
} from "@app/modules/vaccinations/services/services";
import { useVaccinationsProvider } from "@app/modules/vaccinations/states/vaccinationsProvider";

export const useVaccinationsActions = () => {
  const { getVaccinationsState, setVaccinationsState } = useVaccinationsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de vacunaciones.
  const handleLoad = async (): Promise<void> => {
    setVaccinationsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchVaccinations();
      setVaccinationsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las vacunaciones.");
      setVaccinationsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setVaccinationsState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: VaccineStatusFilterType): void => {
    setVaccinationsState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setVaccinationsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la vacunación.
  const handleOpenEdit = (vaccination: VaccinationType): void => {
    setVaccinationsState((s) => ({
      ...s,
      mode: "edit",
      selected: vaccination,
      form: formFromVaccination(vaccination),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la vacunación.
  const handleOpenDetail = (vaccination: VaccinationType): void => {
    setVaccinationsState((s) => ({ ...s, mode: "detail", selected: vaccination }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setVaccinationsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof VaccinationFormType>(
    field: K,
    value: VaccinationFormType[K]
  ): void => {
    setVaccinationsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getVaccinationsState;
    const errors = validateVaccinationForm(form);
    if (Object.keys(errors).length > 0) {
      setVaccinationsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setVaccinationsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateVaccination(selected.id, toVaccinationInput(form));
        onNotification(true, "Vacunación actualizada.");
      } else {
        await createVaccination(toVaccinationInput(form));
        onNotification(true, "Vacunación registrada.");
      }
      setVaccinationsState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar la vacunación. Probá de nuevo.");
      setVaccinationsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una vacunación.
  const handleDelete = async (vaccination: VaccinationType): Promise<void> => {
    try {
      await deleteVaccination(vaccination.id);
      onNotification(true, "Vacunación eliminada.");
      setVaccinationsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la vacunación.");
    }
  };

  return {
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
  };
};
