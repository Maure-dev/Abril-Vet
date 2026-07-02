import type {
  StaffCreatePayloadType,
  StaffFormType,
  StaffType,
  StaffUpdatePayloadType
} from "@app/modules/staff/entities/entities";

// Formulario → payload de alta (incluye contraseña; el backend crea el usuario en Auth).
export function toStaffCreatePayload(form: StaffFormType): StaffCreatePayloadType {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    roles: form.roles,
    phone: form.phone.trim(),
    notes: form.notes.trim(),
    isActive: form.isActive,
    password: form.password
  };
}

// Formulario → payload de edición (perfil + rol + estado; sin email ni contraseña).
export function toStaffUpdatePayload(form: StaffFormType): StaffUpdatePayloadType {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    roles: form.roles,
    phone: form.phone.trim(),
    notes: form.notes.trim(),
    isActive: form.isActive
  };
}

// Miembro del personal existente → formulario (para edición). La contraseña nunca se precarga.
export function formFromStaff(staff: StaffType): StaffFormType {
  return {
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    roles: staff.roles,
    phone: staff.phone,
    isActive: staff.isActive,
    notes: staff.notes,
    password: ""
  };
}
