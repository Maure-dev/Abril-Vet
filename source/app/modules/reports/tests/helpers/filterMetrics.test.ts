import type { ReportMetricType } from "@app/modules/reports/entities/entities";
import { filterMetrics } from "@app/modules/reports/helpers/filterMetrics";
import { describe, expect, it } from "vitest";

// Factory inline (el módulo es de lectura y no comparte factories con otros módulos).
function buildMetric(overrides: Partial<ReportMetricType> = {}): ReportMetricType {
  return { key: "clients", label: "Clientes", value: 10, tone: "brand", ...overrides };
}

const clients = buildMetric();
const sales = buildMetric({ key: "sales", label: "Ventas", value: 3, tone: "success" });

describe("filterMetrics", () => {
  it("sin query ni filtro devuelve todas", () => {
    expect(filterMetrics([clients, sales], "", "all")).toHaveLength(2);
  });

  it("filtra por tono", () => {
    expect(filterMetrics([clients, sales], "", "success")).toEqual([sales]);
  });

  it("busca por etiqueta o clave (case-insensitive)", () => {
    expect(filterMetrics([clients, sales], "vent", "all")).toEqual([sales]);
    expect(filterMetrics([clients, sales], "CLIENTS", "all")).toEqual([clients]);
  });
});
