import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/staff/constants/constants";
import type {
  RoleFilterType,
  StaffFormType,
  StaffType,
  StatusFilterType
} from "@app/modules/staff/entities/entities";
import {
  formFromStaff,
  toStaffCreatePayload,
  toStaffUpdatePayload
} from "@app/modules/staff/helpers/staffMappers";
import { validateStaffForm } from "@app/modules/staff/helpers/validateStaffForm";
import {
  createStaffMember,
  deleteStaffMember,
  fetchStaff,
  updateStaffMember
} from "@app/modules/staff/services/services";
import { useStaffProvider } from "@app/modules/staff/states/staffProvider";

export const useStaffActions = () => {
  const { getStaffState, setStaffState } = useStaffProvider();
  const { onNotification } = useNotification();

  // Carga inicial del personal.
  const handleLoad = async (): Promise<void> => {
    setStaffState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchStaff();
      setStaffState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudo cargar el personal.");
      setStaffState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setStaffState((s) => ({ ...s, query: query }));
  };

  const handleFilterRole = (roleFilter: RoleFilterType): void => {
    setStaffState((s) => ({ ...s, roleFilter: roleFilter }));
  };

  const handleFilterStatus = (statusFilter: StatusFilterType): void => {
    setStaffState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  const handleOpenCreate = (): void => {
    setStaffState((s) => ({ ...s, mode: "create", selected: null, form: EMPTY_FORM, errors: {} }));
  };

  const handleOpenEdit = (staff: StaffType): void => {
    setStaffState((s) => ({
      ...s,
      mode: "edit",
      selected: staff,
      form: formFromStaff(staff),
      errors: {}
    }));
  };

  const handleOpenDetail = (staff: StaffType): void => {
    setStaffState((s) => ({ ...s, mode: "detail", selected: staff }));
  };

  const handleCancel = (): void => {
    setStaffState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof StaffFormType>(
    field: K,
    value: StaffFormType[K]
  ): void => {
    setStaffState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta (crea el usuario en Firebase Auth) o edición de perfil/rol/estado.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getStaffState;
    const isEdit = mode === "edit" && selected !== null;
    const errors = validateStaffForm(form, !isEdit);
    if (Object.keys(errors).length > 0) {
      setStaffState((s) => ({ ...s, errors: errors }));
      return;
    }
    setStaffState((s) => ({ ...s, saving: true }));
    try {
      if (isEdit && selected) {
        await updateStaffMember(selected.id, toStaffUpdatePayload(form));
        onNotification(true, "Personal actualizado.");
      } else {
        await createStaffMember(toStaffCreatePayload(form));
        onNotification(true, "Usuario creado en Firebase Auth y en el directorio.");
      }
      setStaffState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar. Revisá que seas admin y que el email no exista.");
      setStaffState((s) => ({ ...s, saving: false }));
    }
  };

  // Cambia la contraseña del usuario (Admin SDK, vía backend).
  const handleResetPassword = async (staff: StaffType, password: string): Promise<void> => {
    try {
      await updateStaffMember(staff.id, { password: password });
      onNotification(true, "Contraseña actualizada.");
    } catch {
      onNotification(false, "No se pudo cambiar la contraseña.");
    }
  };

  // Habilita / deshabilita el acceso del usuario (disabled en Firebase Auth).
  const handleToggleActive = async (staff: StaffType): Promise<void> => {
    try {
      await updateStaffMember(staff.id, { isActive: !staff.isActive });
      onNotification(true, staff.isActive ? "Acceso deshabilitado." : "Acceso habilitado.");
      setStaffState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cambiar el estado del acceso.");
    }
  };

  // Genera un link de invitación / reseteo de contraseña (lo manda por email si Resend está
  // configurado; si no, lo copia al portapapeles para enviarlo a mano).
  const handleSendInvite = async (staff: StaffType): Promise<void> => {
    try {
      const result = await updateStaffMember(staff.id, { resetLink: true });
      if (result.emailed) {
        onNotification(true, `Invitación enviada por email a ${staff.email}.`);
      } else if (result.resetLink) {
        await navigator.clipboard?.writeText(result.resetLink)?.catch(() => undefined);
        onNotification(true, "Link de acceso copiado al portapapeles.");
      } else {
        onNotification(false, "No se pudo generar el link de invitación.");
      }
    } catch {
      onNotification(false, "No se pudo generar la invitación.");
    }
  };

  // Baja: elimina el usuario de Auth y su perfil.
  const handleDelete = async (staff: StaffType): Promise<void> => {
    try {
      await deleteStaffMember(staff.id);
      onNotification(true, "Personal eliminado.");
      setStaffState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el personal.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleFilterRole,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleResetPassword,
    handleToggleActive,
    handleSendInvite,
    handleDelete
  };
};
