import { computeVaccineStatus } from "@app/modules/vaccinations/helpers/computeVaccineStatus";
import { describe, expect, it } from "vitest";

const now = new Date(2026, 5, 15); // 2026-06-15 (hora local)

describe("computeVaccineStatus", () => {
  it("sin próxima dosis devuelve 'applied'", () => {
    expect(computeVaccineStatus("", now)).toBe("applied");
  });

  it("próxima dosis anterior a hoy devuelve 'overdue'", () => {
    expect(computeVaccineStatus("2026-06-14", now)).toBe("overdue");
    expect(computeVaccineStatus("2025-12-31", now)).toBe("overdue");
  });

  it("próxima dosis hoy o futura devuelve 'pending'", () => {
    expect(computeVaccineStatus("2026-06-15", now)).toBe("pending");
    expect(computeVaccineStatus("2026-12-01", now)).toBe("pending");
  });

  it("parsea por componentes (sin desfase de zona horaria en TZ negativas)", () => {
    // "hoy" debe contar como pendiente sin caer al día anterior por UTC.
    expect(computeVaccineStatus("2026-06-15", now)).toBe("pending");
  });

  it("fecha inválida se trata como sin próxima dosis ('applied')", () => {
    expect(computeVaccineStatus("2026-13-40", now)).toBe("applied");
    expect(computeVaccineStatus("no-es-fecha", now)).toBe("applied");
  });
});
