import { vi } from "vitest";

// Mock de axios compartido para tests de services.
//
// Uso en un archivo de test:
//
//   import { mockAxios } from "@app/modules/main/tests/mockAxios";
//   vi.mock("axios", () => ({ default: mockAxios }));
//
//   beforeEach(() => { vi.clearAllMocks(); });
//
// Para casos simples también podés usar el patrón inline:
//   vi.mock("axios");
//   const mockedAxios = vi.mocked(axios);
export const mockAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  create: vi.fn()
}));
