import { EMPTY_FORM } from "@app/modules/clients/constants/constants";
import type { ClientFormType, ClientType } from "@app/modules/clients/entities/entities";

// Factories de datos del módulo clientes para tests.

export function buildClient(overrides: Partial<ClientType> = {}): ClientType {
  return {
    id: "cli-1",
    firstName: "Ana",
    lastName: "García",
    docId: "30111222",
    email: "ana.garcia@example.com",
    phone: "1145551234",
    whatsapp: "1145551234",
    address: "Av. Siempreviva 742",
    city: "Buenos Aires",
    notes: "",
    isActive: true,
    balance: 0,
    ...overrides
  };
}

export function buildClientForm(overrides: Partial<ClientFormType> = {}): ClientFormType {
  return {
    ...EMPTY_FORM,
    firstName: "Ana",
    lastName: "García",
    phone: "1145551234",
    ...overrides
  };
}
