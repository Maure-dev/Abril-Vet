import MainProvider from "@app/modules/main/states/mainProvider";
import { usePatientsActions } from "@app/modules/patients/hooks/usePatientsActions";
import PatientsProvider, {
  usePatientsProvider
} from "@app/modules/patients/states/patientsProvider";
import { buildPatient } from "@app/modules/patients/tests/factories";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Aislamos el hook mockeando el service (el try/catch vive en el hook, no en el service).
vi.mock("@app/modules/patients/services/services", () => ({
  fetchPatients: vi.fn(),
  createPatient: vi.fn(),
  updatePatient: vi.fn(),
  deletePatient: vi.fn()
}));

import * as services from "@app/modules/patients/services/services";

const mocked = vi.mocked(services);

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MainProvider>
      <PatientsProvider>{children}</PatientsProvider>
    </MainProvider>
  );
}

function setup() {
  return renderHook(() => ({ actions: usePatientsActions(), store: usePatientsProvider() }), {
    wrapper
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocked.fetchPatients.mockResolvedValue([]);
  mocked.createPatient.mockResolvedValue("new-id");
});

describe("usePatientsActions", () => {
  it("handleLoad carga los pacientes en el estado", async () => {
    mocked.fetchPatients.mockResolvedValueOnce([buildPatient()]);
    const { result } = setup();

    await act(async () => {
      await result.current.actions.handleLoad();
    });

    expect(mocked.fetchPatients).toHaveBeenCalled();
    expect(result.current.store.getPatientsState.items).toHaveLength(1);
    expect(result.current.store.getPatientsState.loading).toBe(false);
  });

  it("handleSubmit no crea si el formulario es inválido y setea errores", async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.actions.handleSubmit();
    });

    expect(mocked.createPatient).not.toHaveBeenCalled();
    expect(result.current.store.getPatientsState.errors.name).toBeDefined();
  });

  it("handleSubmit crea el paciente cuando el formulario es válido", async () => {
    const { result } = setup();

    act(() => {
      result.current.actions.handleChangeField("name", "Firulais");
      result.current.actions.handleChangeField("clientId", "cli-1");
    });

    await act(async () => {
      await result.current.actions.handleSubmit();
    });

    expect(mocked.createPatient).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(result.current.store.getPatientsState.mode).toBe("list");
    });
  });
});
