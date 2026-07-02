import type { UserRoleType } from "@app/modules/main/entities/entities";
import type { Dispatch, SetStateAction } from "react";

// Filtro de rol en la lista ("all" = todos).
export type RoleFilterType = UserRoleType | "all";

// Filtro de estado en la lista ("all" = todos, "active" = activos, "inactive" = inactivos).
export type StatusFilterType = "all" | "active" | "inactive";

// Modo de la página (lista / alta / edición / ficha).
export type StaffModeType = "list" | "create" | "edit" | "detail";

// ── Personal (miembro del equipo de la veterinaria) ──
// El acceso real (usuario + contraseña) vive en Firebase Auth; esta entidad es el directorio
// administrativo del personal. El vínculo con Auth es opcional (uid).
export type StaffType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoleType[];
  phone: string;
  isActive: boolean;
  uid: string; // vínculo opcional con Firebase Auth ("" si no está vinculado)
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// ── Formulario (campos como string, salvo el estado; password sólo se usa al crear) ──
export type StaffFormType = {
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoleType[];
  phone: string;
  isActive: boolean;
  notes: string;
  password: string;
};

// ── Payloads al backend (Vercel Functions con Firebase Admin SDK) ──
export type StaffCreatePayloadType = {
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoleType[];
  phone: string;
  notes: string;
  isActive: boolean;
  password: string;
};

export type StaffUpdatePayloadType = {
  firstName?: string;
  lastName?: string;
  roles?: UserRoleType[];
  phone?: string;
  notes?: string;
  isActive?: boolean;
  password?: string;
  resetLink?: boolean;
};

export type StaffResetLinkResultType = {
  ok: boolean;
  resetLink?: string;
  emailed?: boolean;
};

export type StaffFormErrorsType = Partial<Record<keyof StaffFormType, string>>;

// ── Estado y contexto del módulo ──
export type StaffDataType = {
  items: StaffType[];
  loading: boolean;
  query: string;
  roleFilter: RoleFilterType;
  statusFilter: StatusFilterType;
  mode: StaffModeType;
  selected: StaffType | null;
  form: StaffFormType;
  errors: StaffFormErrorsType;
  saving: boolean;
};

export type StaffContextType = {
  getStaffState: StaffDataType;
  setStaffState: Dispatch<SetStateAction<StaffDataType>>;
};
