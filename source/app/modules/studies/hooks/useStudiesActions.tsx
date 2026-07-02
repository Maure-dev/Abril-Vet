import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/studies/constants/constants";
import type {
  StudyFormType,
  StudyStatusFilterType,
  StudyType,
  StudyTypeFilterType
} from "@app/modules/studies/entities/entities";
import { formFromStudy, toStudyInput } from "@app/modules/studies/helpers/studyMappers";
import { validateStudiesForm } from "@app/modules/studies/helpers/validateStudiesForm";
import {
  createStudy,
  deleteStudy,
  fetchStudies,
  updateStudy
} from "@app/modules/studies/services/services";
import { useStudiesProvider } from "@app/modules/studies/states/studiesProvider";

export const useStudiesActions = () => {
  const { getStudiesState, setStudiesState } = useStudiesProvider();
  const { onNotification } = useNotification();

  // Carga inicial de estudios.
  const handleLoad = async (): Promise<void> => {
    setStudiesState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchStudies();
      setStudiesState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los estudios.");
      setStudiesState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setStudiesState((s) => ({ ...s, query: query }));
  };

  const handleFilterType = (typeFilter: StudyTypeFilterType): void => {
    setStudiesState((s) => ({ ...s, typeFilter: typeFilter }));
  };

  const handleFilterStatus = (statusFilter: StudyStatusFilterType): void => {
    setStudiesState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setStudiesState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el estudio.
  const handleOpenEdit = (study: StudyType): void => {
    setStudiesState((s) => ({
      ...s,
      mode: "edit",
      selected: study,
      form: formFromStudy(study),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del estudio.
  const handleOpenDetail = (study: StudyType): void => {
    setStudiesState((s) => ({ ...s, mode: "detail", selected: study }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setStudiesState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof StudyFormType>(
    field: K,
    value: StudyFormType[K]
  ): void => {
    setStudiesState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getStudiesState;
    const errors = validateStudiesForm(form);
    if (Object.keys(errors).length > 0) {
      setStudiesState((s) => ({ ...s, errors: errors }));
      return;
    }
    setStudiesState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateStudy(selected.id, toStudyInput(form, { attachments: selected.attachments }));
        onNotification(true, "Estudio actualizado.");
      } else {
        await createStudy(toStudyInput(form));
        onNotification(true, "Estudio creado.");
      }
      setStudiesState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar el estudio. Probá de nuevo.");
      setStudiesState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un estudio.
  const handleDelete = async (study: StudyType): Promise<void> => {
    try {
      await deleteStudy(study.id);
      onNotification(true, "Estudio eliminado.");
      setStudiesState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el estudio.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleFilterType,
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
