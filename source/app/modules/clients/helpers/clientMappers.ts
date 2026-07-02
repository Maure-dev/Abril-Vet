import type {
  ClientFormType,
  ClientInputType,
  ClientType
} from "@app/modules/clients/entities/entities";

// Convierte el saldo del formulario (string) a entero, o 0 si está vacío / inválido.
export function parseBalance(value: string): number {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  const balance = Number(trimmed);
  return Number.isInteger(balance) ? balance : 0;
}

// Formulario → datos persistibles.
export function toClientInput(form: ClientFormType): ClientInputType {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    docId: form.docId.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    notes: form.notes.trim(),
    balance: parseBalance(form.balance),
    isActive: form.isActive
  };
}

// Cliente existente → formulario (para edición).
export function formFromClient(client: ClientType): ClientFormType {
  return {
    firstName: client.firstName,
    lastName: client.lastName,
    docId: client.docId,
    email: client.email,
    phone: client.phone,
    whatsapp: client.whatsapp,
    address: client.address,
    city: client.city,
    notes: client.notes,
    balance: String(client.balance),
    isActive: client.isActive
  };
}
