import type { Dispatch, ReactNode, SetStateAction } from "react";

// Tipo compartido por todos los providers de la app.
export type ChildrenType = { children: ReactNode };

// ── Tema (modo claro/oscuro) ──
export type ThemeType = "light" | "dark";

// ── Roles y sesión (dominio compartido, union types sin enum) ──

// Roles del personal de la veterinaria. El rol vive en un custom claim del token de Firebase Auth.
export type UserRoleType = "admin" | "vet" | "receptionist" | "assistant";

export type AuthStatusType = "loading" | "authenticated" | "guest";

export type CurrentUserType = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Un usuario puede tener varios roles (ve las vistas de todos ellos).
  roles: UserRoleType[];
};

export type SessionType = {
  status: AuthStatusType;
  user: CurrentUserType | null;
};

// ── Tipos de valor compartidos entre módulos ──

// Monto en pesos argentinos (entero). Única convención monetaria del proyecto
// (la usan facturación, ventas, productos, compras, caja y reportes).
export type MoneyType = { amount: number; currency: "ARS" };

// Imagen asociada a una entidad (foto de paciente, imagen de producto, imagen de estudio).
export type ImageType = {
  url: string;
  alt: string;
  order?: number;
  isPrimary?: boolean;
};

// Archivo adjunto (estudios, cirugías, historia clínica, resultados de laboratorio).
export type AttachmentType = {
  url: string;
  name: string;
  contentType: string;
  sizeBytes?: number;
  uploadedAt?: string;
};

// Resultado de una subida a Cloudinary (ver modules/main/services/fileUpload.ts).
export type UploadedFileType = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
  name: string;
};

// ── Lookups (selectores de entidades relacionadas) ──

// Qué colección se puede buscar/seleccionar desde un formulario.
export type LookupKindType = "clients" | "patients" | "vets" | "products";

// Opción de un selector: id + etiqueta (y una línea secundaria opcional).
// `clientId` sólo lo llevan los pacientes (dueño), para derivar/vincular el cliente.
export type OptionType = {
  id: string;
  label: string;
  sublabel?: string;
  clientId?: string;
};

// ── Notificación global (toast) ──

export type NotificationType = {
  open: boolean;
  status: boolean;
  message: string;
};

// ── Estado y contexto del módulo main ──

export type MainDataType = {
  notification: NotificationType;
  session: SessionType;
};

export type MainContextType = {
  getMainState: MainDataType;
  setMainState: Dispatch<SetStateAction<MainDataType>>;
};
