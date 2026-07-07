import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/medicalRecords/constants/constants";
import type {
  MedicalRecordFormType,
  MedicalRecordPrefillType,
  MedicalRecordType
} from "@app/modules/medicalRecords/entities/entities";
import {
  formFromMedicalRecord,
  toMedicalRecordInput
} from "@app/modules/medicalRecords/helpers/recordMappers";
import { validateMedicalRecordForm } from "@app/modules/medicalRecords/helpers/validateMedicalRecordForm";
import {
  createMedicalRecord,
  deleteMedicalRecord,
  fetchMedicalRecords,
  updateMedicalRecord
} from "@app/modules/medicalRecords/services/services";
import { useMedicalRecordsProvider } from "@app/modules/medicalRecords/states/medicalRecordsProvider";

export const useMedicalRecordsActions = () => {
  const { getMedicalRecordsState, setMedicalRecordsState } = useMedicalRecordsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de registros.
  const handleLoad = async (): Promise<void> => {
    setMedicalRecordsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchMedicalRecords();
      setMedicalRecordsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los registros clínicos.");
      setMedicalRecordsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setMedicalRecordsState((s) => ({ ...s, query: query }));
  };

  const handleFilterPatient = (patientFilter: string): void => {
    setMedicalRecordsState((s) => ({ ...s, patientFilter: patientFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setMedicalRecordsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el alta con el formulario precargado (p. ej. desde un turno: paciente, vet y fecha).
  const handleOpenCreatePrefilled = (prefill: MedicalRecordPrefillType): void => {
    setMedicalRecordsState((s) => ({
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

  // Abre el formulario de edición cargado con el registro.
  const handleOpenEdit = (record: MedicalRecordType): void => {
    setMedicalRecordsState((s) => ({
      ...s,
      mode: "edit",
      selected: record,
      form: formFromMedicalRecord(record),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del registro.
  const handleOpenDetail = (record: MedicalRecordType): void => {
    setMedicalRecordsState((s) => ({ ...s, mode: "detail", selected: record }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setMedicalRecordsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof MedicalRecordFormType>(
    field: K,
    value: MedicalRecordFormType[K]
  ): void => {
    setMedicalRecordsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getMedicalRecordsState;
    const errors = validateMedicalRecordForm(form);
    if (Object.keys(errors).length > 0) {
      setMedicalRecordsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setMedicalRecordsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateMedicalRecord(selected.id, toMedicalRecordInput(form));
        onNotification(true, "Registro clínico actualizado.");
      } else {
        await createMedicalRecord(toMedicalRecordInput(form));
        onNotification(true, "Registro clínico creado.");
      }
      await handleLoad();
      setMedicalRecordsState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar el registro clínico. Probá de nuevo.");
      setMedicalRecordsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un registro.
  const handleDelete = async (record: MedicalRecordType): Promise<void> => {
    try {
      await deleteMedicalRecord(record.id);
      onNotification(true, "Registro clínico eliminado.");
      setMedicalRecordsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el registro clínico.");
    }
  };

  return {
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
  };
};
