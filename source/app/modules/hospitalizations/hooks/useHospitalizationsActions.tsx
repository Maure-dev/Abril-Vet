import { EMPTY_FORM, STATUS_LABELS } from "@app/modules/hospitalizations/constants/constants";
import type {
  HospitalizationFormType,
  HospitalizationPrefillType,
  HospitalizationStatusFilterType,
  HospitalizationStatusType,
  HospitalizationType
} from "@app/modules/hospitalizations/entities/entities";
import {
  formFromHospitalization,
  toHospitalizationInput
} from "@app/modules/hospitalizations/helpers/hospitalizationMappers";
import { validateHospitalizationForm } from "@app/modules/hospitalizations/helpers/validateHospitalizationForm";
import {
  createHospitalization,
  deleteHospitalization,
  fetchHospitalizations,
  updateHospitalization
} from "@app/modules/hospitalizations/services/services";
import { useHospitalizationsProvider } from "@app/modules/hospitalizations/states/hospitalizationsProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

export const useHospitalizationsActions = () => {
  const { getHospitalizationsState, setHospitalizationsState } = useHospitalizationsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de internaciones.
  const handleLoad = async (): Promise<void> => {
    setHospitalizationsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchHospitalizations();
      setHospitalizationsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las internaciones.");
      setHospitalizationsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setHospitalizationsState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: HospitalizationStatusFilterType): void => {
    setHospitalizationsState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Cambia sólo el estado de una internación (combo en la lista), sin editar.
  const handleQuickStatus = async (
    hospitalization: HospitalizationType,
    status: HospitalizationStatusType
  ): Promise<void> => {
    if (hospitalization.status === status) {
      return;
    }
    try {
      await updateHospitalization(
        hospitalization.id,
        toHospitalizationInput({ ...formFromHospitalization(hospitalization), status: status })
      );
      onNotification(true, `Internación: ${STATUS_LABELS[status]}.`);
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cambiar el estado de la internación.");
    }
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setHospitalizationsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de alta precargado (p. ej. "Registrar atención" desde un turno).
  // Sólo se mapean los campos que existen en este módulo (no hay vetId acá).
  const handleOpenCreatePrefilled = (prefill: HospitalizationPrefillType): void => {
    setHospitalizationsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      errors: {},
      form: {
        ...EMPTY_FORM,
        patientId: prefill.patientId ?? EMPTY_FORM.patientId,
        admissionDate: prefill.date ?? EMPTY_FORM.admissionDate
      }
    }));
  };

  // Abre el formulario de edición cargado con la internación.
  const handleOpenEdit = (hospitalization: HospitalizationType): void => {
    setHospitalizationsState((s) => ({
      ...s,
      mode: "edit",
      selected: hospitalization,
      form: formFromHospitalization(hospitalization),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la internación.
  const handleOpenDetail = (hospitalization: HospitalizationType): void => {
    setHospitalizationsState((s) => ({ ...s, mode: "detail", selected: hospitalization }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setHospitalizationsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof HospitalizationFormType>(
    field: K,
    value: HospitalizationFormType[K]
  ): void => {
    setHospitalizationsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getHospitalizationsState;
    const errors = validateHospitalizationForm(form);
    if (Object.keys(errors).length > 0) {
      setHospitalizationsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setHospitalizationsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateHospitalization(selected.id, toHospitalizationInput(form));
        onNotification(true, "Internación actualizada.");
      } else {
        await createHospitalization(toHospitalizationInput(form));
        onNotification(true, "Internación creada.");
      }
      await handleLoad();
      setHospitalizationsState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar la internación. Probá de nuevo.");
      setHospitalizationsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una internación.
  const handleDelete = async (hospitalization: HospitalizationType): Promise<void> => {
    try {
      await deleteHospitalization(hospitalization.id);
      onNotification(true, "Internación eliminada.");
      setHospitalizationsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la internación.");
    }
  };

  return {
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
  };
};
