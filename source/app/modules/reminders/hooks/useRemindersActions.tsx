import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM, REMINDER_STATUS_LABELS } from "@app/modules/reminders/constants/constants";
import type {
  ReminderFormType,
  ReminderStatusFilterType,
  ReminderStatusType,
  ReminderType,
  ReminderTypeFilterType
} from "@app/modules/reminders/entities/entities";
import { formFromReminder, toReminderInput } from "@app/modules/reminders/helpers/reminderMappers";
import { validateReminderForm } from "@app/modules/reminders/helpers/validateReminderForm";
import {
  createReminder,
  deleteReminder,
  fetchReminders,
  updateReminder
} from "@app/modules/reminders/services/services";
import { useRemindersProvider } from "@app/modules/reminders/states/remindersProvider";

export const useRemindersActions = () => {
  const { getRemindersState, setRemindersState } = useRemindersProvider();
  const { onNotification } = useNotification();

  // Carga inicial de recordatorios.
  const handleLoad = async (): Promise<void> => {
    setRemindersState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchReminders();
      setRemindersState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los recordatorios.");
      setRemindersState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setRemindersState((s) => ({ ...s, query: query }));
  };

  const handleFilterType = (typeFilter: ReminderTypeFilterType): void => {
    setRemindersState((s) => ({ ...s, typeFilter: typeFilter }));
  };

  const handleFilterStatus = (statusFilter: ReminderStatusFilterType): void => {
    setRemindersState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Cambia sólo el estado de un recordatorio (combo en la lista), sin editar.
  const handleQuickStatus = async (
    reminder: ReminderType,
    status: ReminderStatusType
  ): Promise<void> => {
    if (reminder.status === status) {
      return;
    }
    try {
      await updateReminder(
        reminder.id,
        toReminderInput({ ...formFromReminder(reminder), status: status })
      );
      onNotification(true, `Recordatorio: ${REMINDER_STATUS_LABELS[status]}.`);
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cambiar el estado del recordatorio.");
    }
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setRemindersState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el recordatorio.
  const handleOpenEdit = (reminder: ReminderType): void => {
    setRemindersState((s) => ({
      ...s,
      mode: "edit",
      selected: reminder,
      form: formFromReminder(reminder),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del recordatorio.
  const handleOpenDetail = (reminder: ReminderType): void => {
    setRemindersState((s) => ({ ...s, mode: "detail", selected: reminder }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setRemindersState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof ReminderFormType>(
    field: K,
    value: ReminderFormType[K]
  ): void => {
    setRemindersState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getRemindersState;
    const errors = validateReminderForm(form);
    if (Object.keys(errors).length > 0) {
      setRemindersState((s) => ({ ...s, errors: errors }));
      return;
    }
    setRemindersState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateReminder(selected.id, toReminderInput(form));
        onNotification(true, "Recordatorio actualizado.");
      } else {
        await createReminder(toReminderInput(form));
        onNotification(true, "Recordatorio creado.");
      }
      await handleLoad();
      setRemindersState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar el recordatorio. Probá de nuevo.");
      setRemindersState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un recordatorio.
  const handleDelete = async (reminder: ReminderType): Promise<void> => {
    try {
      await deleteReminder(reminder.id);
      onNotification(true, "Recordatorio eliminado.");
      setRemindersState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el recordatorio.");
    }
  };

  // Cancela un recordatorio (cambia su estado a "cancelled").
  const handleCancelReminder = async (reminder: ReminderType): Promise<void> => {
    try {
      await updateReminder(
        reminder.id,
        toReminderInput({ ...formFromReminder(reminder), status: "cancelled" })
      );
      onNotification(true, "Recordatorio cancelado.");
      setRemindersState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cancelar el recordatorio.");
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
    handleCancelReminder,
    handleQuickStatus
  };
};
