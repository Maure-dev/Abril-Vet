import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/surgeries/constants/constants";
import type {
  SurgeryFormType,
  SurgeryStatusFilterType,
  SurgeryType
} from "@app/modules/surgeries/entities/entities";
import { formFromSurgery, toSurgeryInput } from "@app/modules/surgeries/helpers/surgeryMappers";
import { validateSurgeriesForm } from "@app/modules/surgeries/helpers/validateSurgeriesForm";
import {
  createSurgery,
  deleteSurgery,
  fetchSurgeries,
  updateSurgery
} from "@app/modules/surgeries/services/services";
import { useSurgeriesProvider } from "@app/modules/surgeries/states/surgeriesProvider";

export const useSurgeriesActions = () => {
  const { getSurgeriesState, setSurgeriesState } = useSurgeriesProvider();
  const { onNotification } = useNotification();

  // Carga inicial de cirugías.
  const handleLoad = async (): Promise<void> => {
    setSurgeriesState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchSurgeries();
      setSurgeriesState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las cirugías.");
      setSurgeriesState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setSurgeriesState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: SurgeryStatusFilterType): void => {
    setSurgeriesState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setSurgeriesState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la cirugía.
  const handleOpenEdit = (surgery: SurgeryType): void => {
    setSurgeriesState((s) => ({
      ...s,
      mode: "edit",
      selected: surgery,
      form: formFromSurgery(surgery),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la cirugía.
  const handleOpenDetail = (surgery: SurgeryType): void => {
    setSurgeriesState((s) => ({ ...s, mode: "detail", selected: surgery }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setSurgeriesState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof SurgeryFormType>(
    field: K,
    value: SurgeryFormType[K]
  ): void => {
    setSurgeriesState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getSurgeriesState;
    const errors = validateSurgeriesForm(form);
    if (Object.keys(errors).length > 0) {
      setSurgeriesState((s) => ({ ...s, errors: errors }));
      return;
    }
    setSurgeriesState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateSurgery(selected.id, toSurgeryInput(form));
        onNotification(true, "Cirugía actualizada.");
      } else {
        await createSurgery(toSurgeryInput(form));
        onNotification(true, "Cirugía creada.");
      }
      setSurgeriesState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar la cirugía. Probá de nuevo.");
      setSurgeriesState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una cirugía.
  const handleDelete = async (surgery: SurgeryType): Promise<void> => {
    try {
      await deleteSurgery(surgery.id);
      onNotification(true, "Cirugía eliminada.");
      setSurgeriesState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la cirugía.");
    }
  };

  // Cancela una cirugía (cambia su estado a "cancelled") sin borrarla.
  const handleCancelSurgery = async (surgery: SurgeryType): Promise<void> => {
    try {
      await updateSurgery(surgery.id, {
        ...toSurgeryInput(formFromSurgery(surgery)),
        status: "cancelled"
      });
      onNotification(true, "Cirugía cancelada.");
      setSurgeriesState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cancelar la cirugía.");
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
    handleDelete,
    handleCancelSurgery
  };
};
