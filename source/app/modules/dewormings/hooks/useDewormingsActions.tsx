import { EMPTY_FORM } from "@app/modules/dewormings/constants/constants";
import type {
  DewormingFormType,
  DewormingPrefillType,
  DewormingStatusFilterType,
  DewormingType
} from "@app/modules/dewormings/entities/entities";
import {
  formFromDeworming,
  toDewormingInput
} from "@app/modules/dewormings/helpers/dewormingMappers";
import { validateDewormingForm } from "@app/modules/dewormings/helpers/validateDewormingForm";
import {
  createDeworming,
  deleteDeworming,
  fetchDewormings,
  updateDeworming
} from "@app/modules/dewormings/services/services";
import { useDewormingsProvider } from "@app/modules/dewormings/states/dewormingsProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

export const useDewormingsActions = () => {
  const { getDewormingsState, setDewormingsState } = useDewormingsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de desparasitaciones.
  const handleLoad = async (): Promise<void> => {
    setDewormingsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchDewormings();
      setDewormingsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las desparasitaciones.");
      setDewormingsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setDewormingsState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: DewormingStatusFilterType): void => {
    setDewormingsState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setDewormingsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el alta con el formulario precargado (p. ej. desde "Registrar atención" de un turno).
  const handleOpenCreatePrefilled = (prefill: DewormingPrefillType): void => {
    setDewormingsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      errors: {},
      form: {
        ...EMPTY_FORM,
        patientId: prefill.patientId ?? EMPTY_FORM.patientId,
        vetId: prefill.vetId ?? EMPTY_FORM.vetId,
        date: prefill.date ?? EMPTY_FORM.date
      }
    }));
  };

  // Abre el formulario de edición cargado con la desparasitación.
  const handleOpenEdit = (deworming: DewormingType): void => {
    setDewormingsState((s) => ({
      ...s,
      mode: "edit",
      selected: deworming,
      form: formFromDeworming(deworming),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la desparasitación.
  const handleOpenDetail = (deworming: DewormingType): void => {
    setDewormingsState((s) => ({ ...s, mode: "detail", selected: deworming }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setDewormingsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof DewormingFormType>(
    field: K,
    value: DewormingFormType[K]
  ): void => {
    setDewormingsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getDewormingsState;
    const errors = validateDewormingForm(form);
    if (Object.keys(errors).length > 0) {
      setDewormingsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setDewormingsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateDeworming(selected.id, toDewormingInput(form));
        onNotification(true, "Desparasitación actualizada.");
      } else {
        await createDeworming(toDewormingInput(form));
        onNotification(true, "Desparasitación registrada.");
      }
      await handleLoad();
      setDewormingsState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar la desparasitación. Probá de nuevo.");
      setDewormingsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una desparasitación.
  const handleDelete = async (deworming: DewormingType): Promise<void> => {
    try {
      await deleteDeworming(deworming.id);
      onNotification(true, "Desparasitación eliminada.");
      setDewormingsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la desparasitación.");
    }
  };

  return {
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
  };
};
