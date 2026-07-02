import { vi } from "vitest";

// Mock de axios compartido para tests de services.
// El nombre empieza con "mock" a propósito: eso habilita referenciarlo dentro de la fábrica de
// vi.mock (Vitest permite variables con prefijo mock*).
//
// Uso en un archivo de test:
//   import { mockAxios } from "@app/modules/main/tests/mockAxios";
//   vi.mock("axios", () => ({ default: mockAxios }));
//
//   beforeEach(() => { vi.clearAllMocks(); });
export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  create: vi.fn()
};
