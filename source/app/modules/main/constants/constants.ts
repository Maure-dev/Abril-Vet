import type { MainDataType, UserRoleType } from "@app/modules/main/entities/entities";

// Clave de persistencia del tema (claro/oscuro) en localStorage.
export const THEME_STORAGE_KEY = "abril_vet_theme_v1";

// Roles por defecto cuando el token no trae un custom claim de roles válido (mínimo privilegio).
export const DEFAULT_ROLES: UserRoleType[] = ["assistant"];

// Etiquetas de rol en español para la UI.
export const ROLE_LABELS: Record<UserRoleType, string> = {
  admin: "Administrador",
  vet: "Veterinario",
  receptionist: "Recepcionista",
  assistant: "Asistente"
};

export const INITIAL_STATE = {
  MAIN_PAGE: {
    notification: { open: false, status: true, message: "" },
    session: { status: "loading", user: null }
  } satisfies MainDataType
};
