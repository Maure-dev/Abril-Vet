import {
  APPOINTMENT_STATUS_LABELS,
  EMPTY_FORM
} from "@app/modules/appointments/constants/constants";
import type {
  AppointmentFormType,
  AppointmentStatusFilterType,
  AppointmentStatusType,
  AppointmentsViewType,
  AppointmentType,
  AppointmentTypeFilterType
} from "@app/modules/appointments/entities/entities";
import {
  formFromAppointment,
  toAppointmentInput
} from "@app/modules/appointments/helpers/appointmentMappers";
import { findAppointmentConflict } from "@app/modules/appointments/helpers/findAppointmentConflict";
import { validateAppointmentForm } from "@app/modules/appointments/helpers/validateAppointmentForm";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  updateAppointment
} from "@app/modules/appointments/services/services";
import { useAppointmentsProvider } from "@app/modules/appointments/states/appointmentsProvider";
import { addDays, startOfWeek, todayStr } from "@app/modules/main/helpers/weekDates";
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

  const handleFilterVet = (vetFilter: string): void => {
    setAppointmentsState((s) => ({ ...s, vetFilter: vetFilter }));
  };

  // Cambia sólo el estado de un turno (combo en la lista o arrastre en el tablero), sin editar.
  const handleQuickStatus = async (
    appointment: AppointmentType,
    status: AppointmentStatusType
  ): Promise<void> => {
    if (appointment.status === status) {
      return;
    }
    try {
      await updateAppointment(
        appointment.id,
        toAppointmentInput({ ...formFromAppointment(appointment), status: status })
      );
      onNotification(true, `Turno: ${APPOINTMENT_STATUS_LABELS[status]}.`);
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cambiar el estado del turno.");
    }
  };

  // Reasigna (o desasigna, con vetId vacío) el veterinario de un turno desde el detalle, sin abrir
  // el formulario completo. Al asignar, verifica que el veterinario no tenga otro turno en ese horario.
  const handleQuickVet = async (appointment: AppointmentType, vetId: string): Promise<void> => {
    if (appointment.vetId === vetId) {
      return;
    }
    // Sólo hay superposición que chequear si se asigna un veterinario (vacío = desasignar).
    const conflict = vetId
      ? findAppointmentConflict(
          { vetId: vetId, date: appointment.date, durationMin: String(appointment.durationMin) },
          getAppointmentsState.items,
          appointment.id
        )
      : null;
    if (conflict) {
      onNotification(false, "Ese veterinario ya tiene un turno en ese horario.");
      return;
    }
    try {
      await updateAppointment(
        appointment.id,
        toAppointmentInput({ ...formFromAppointment(appointment), vetId: vetId })
      );
      onNotification(
        true,
        vetId ? "Veterinario reasignado." : "Se quitó el veterinario del turno."
      );
      await handleLoad();
      // Mantiene abierto el detalle con el turno actualizado.
      setAppointmentsState((s) => {
        if (s.mode !== "detail") {
          return s;
        }
        const updated = s.items.find((item) => item.id === appointment.id) ?? s.selected;
        return { ...s, selected: updated };
      });
    } catch {
      onNotification(false, "No se pudo reasignar el veterinario.");
    }
  };

  // Alterna entre vista de tabla y calendario semanal.
  const handleSetView = (view: AppointmentsViewType): void => {
    setAppointmentsState((s) => ({ ...s, view: view }));
  };

  const handlePrevWeek = (): void => {
    setAppointmentsState((s) => ({
      ...s,
      weekStart: addDays(s.weekStart || startOfWeek(todayStr()), -7)
    }));
  };

  const handleNextWeek = (): void => {
    setAppointmentsState((s) => ({
      ...s,
      weekStart: addDays(s.weekStart || startOfWeek(todayStr()), 7)
    }));
  };

  const handleToday = (): void => {
    setAppointmentsState((s) => ({ ...s, weekStart: startOfWeek(todayStr()) }));
  };

  // Abre el alta de turno con la fecha del día elegido en el calendario (9:00 por defecto).
  const handleOpenCreateOnDate = (dateStr: string): void => {
    setAppointmentsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: { ...EMPTY_FORM, date: `${dateStr}T09:00` },
      errors: {}
    }));
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
    // No se puede agendar en el pasado. En edición sólo se controla si se movió la fecha/hora.
    // Se compara contra el inicio del minuto actual (igual que el generador de horarios, que
    // trunca "ahora" al minuto), para no rechazar el slot que sí se ofreció.
    const nowMs = Date.now();
    const chosen = new Date(form.date);
    const movedDate = !(mode === "edit" && selected) || selected.date !== form.date;
    if (
      movedDate &&
      !Number.isNaN(chosen.getTime()) &&
      chosen.getTime() < nowMs - (nowMs % 60000)
    ) {
      onNotification(false, "No se puede agendar un turno en el pasado.");
      setAppointmentsState((s) => ({
        ...s,
        errors: { ...s.errors, date: "El turno no puede ser en el pasado." }
      }));
      return;
    }
    // El veterinario no puede tener dos turnos en el mismo horario.
    const conflict = findAppointmentConflict(
      { vetId: form.vetId, date: form.date, durationMin: form.durationMin },
      getAppointmentsState.items,
      selected?.id ?? ""
    );
    if (conflict) {
      onNotification(false, "Ese horario ya está ocupado para ese veterinario.");
      setAppointmentsState((s) => ({
        ...s,
        errors: { ...s.errors, date: "El veterinario ya tiene un turno en ese horario." }
      }));
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
      await handleLoad();
      setAppointmentsState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
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
    handleCancelAppointment,
    handleQuickStatus,
    handleQuickVet,
    handleFilterVet,
    handleSetView,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleOpenCreateOnDate
  };
};
