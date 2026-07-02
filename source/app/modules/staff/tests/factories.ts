import { EMPTY_FORM } from "@app/modules/staff/constants/constants";
import type { StaffFormType, StaffType } from "@app/modules/staff/entities/entities";

// Factories de datos del módulo personal para tests.

export function buildStaff(overrides: Partial<StaffType> = {}): StaffType {
  return {
    id: "staff-1",
    firstName: "Ana",
    lastName: "Gómez",
    email: "ana.gomez@abrilvet.com",
    roles: ["vet"],
    phone: "1122334455",
    isActive: true,
    uid: "",
    notes: "",
    ...overrides
  };
}

export function buildStaffForm(overrides: Partial<StaffFormType> = {}): StaffFormType {
  return {
    ...EMPTY_FORM,
    firstName: "Ana",
    lastName: "Gómez",
    email: "ana.gomez@abrilvet.com",
    roles: ["vet"],
    ...overrides
  };
}
