import { EMPTY_FORM } from "@app/modules/appointments/constants/constants";
import type {
  AppointmentFormType,
  AppointmentStatusFilterType,
  AppointmentType,
  AppointmentTypeFilterType
} from "@app/modules/appointments/entities/entities";
import {
  formFromAppointment,
  toAppointmentInput
} from "@app/modules/appointments/helpers/appointmentMappers";
import { validateAppointmentForm } from "@app/modules/appointments/helpers/validateAppointmentForm";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  updateAppointment
} from "@app/modules/appointments/services/services";
import { useAppointmentsProvider } from "@app/modules/appointments/states/appointmentsProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

export const useAppointmentsActions = () => {
  const { getAppointmentsState, setAppointmentsState } = useAppointmentsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de turnos.
  const handleLoad = async (): Promise<void> => {
    setAppointmentsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchAppointments();
      setAppointmentsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los turnos.");
      setAppointmentsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setAppointmentsState((s) => ({ ...s, query: query }));
  };

  const handleFilterType = (typeFilter: AppointmentTypeFilterType): void => {
    setAppointmentsState((s) => ({ ...s, typeFilter: typeFilter }));
  };

  const handleFilterStatus = (statusFilter: AppointmentStatusFilterType): void => {
    setAppointmentsState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setAppointmentsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el turno.
  const handleOpenEdit = (appointment: AppointmentType): void => {
    setAppointmentsState((s) => ({
      ...s,
      mode: "edit",
      selected: appointment,
      form: formFromAppointment(appointment),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del turno.
  const handleOpenDetail = (appointment: AppointmentType): void => {
    setAppointmentsState((s) => ({ ...s, mode: "detail", selected: appointment }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setAppointmentsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof AppointmentFormType>(
    field: K,
    value: AppointmentFormType[K]
  ): void => {
    setAppointmentsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getAppointmentsState;
    const errors = validateAppointmentForm(form);
    if (Object.keys(errors).length > 0) {
      setAppointmentsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setAppointmentsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateAppointment(selected.id, toAppointmentInput(form));
        onNotification(true, "Turno actualizado.");
      } else {
        await createAppointment(toAppointmentInput(form));
        onNotification(true, "Turno creado.");
      }
      setAppointmentsState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar el turno. Probá de nuevo.");
      setAppointmentsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un turno.
  const handleDelete = async (appointment: AppointmentType): Promise<void> => {
    try {
      await deleteAppointment(appointment.id);
      onNotification(true, "Turno eliminado.");
      setAppointmentsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el turno.");
    }
  };

  // Marca un turno como cancelado (cambia el estado, no lo borra).
  const handleCancelAppointment = async (appointment: AppointmentType): Promise<void> => {
    try {
      await updateAppointment(
        appointment.id,
        toAppointmentInput({ ...formFromAppointment(appointment), status: "cancelled" })
      );
      onNotification(true, "Turno cancelado.");
      setAppointmentsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cancelar el turno.");
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
    handleDelete,
    handleCancelAppointment
  };
};
