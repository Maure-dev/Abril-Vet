import type { ClientType } from "@app/modules/clients/entities/entities";

// Función pura: arma el nombre para mostrar como "Apellido, Nombre".
// Si falta alguna de las dos partes, devuelve la que haya (sin coma ni espacios sueltos).
export function formatClientName(client: Pick<ClientType, "firstName" | "lastName">): string {
  const lastName = client.lastName.trim();
  const firstName = client.firstName.trim();
  if (lastName.length === 0) {
    return firstName;
  }
  if (firstName.length === 0) {
    return lastName;
  }
  return `${lastName}, ${firstName}`;
}
