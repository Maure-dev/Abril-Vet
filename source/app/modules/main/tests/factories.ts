import type { CurrentUserType } from "@app/modules/main/entities/entities";

// Factories de datos compartidos para tests. Cada módulo agrega las suyas en modules/[name]/tests.

export function buildCurrentUser(overrides: Partial<CurrentUserType> = {}): CurrentUserType {
  return {
    uid: "uid-1",
    email: "vet@abril.test",
    displayName: "Dra. de prueba",
    photoURL: null,
    role: "vet",
    ...overrides
  };
}
