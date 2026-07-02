import { filterSurgeries } from "@app/modules/surgeries/helpers/filterSurgeries";
import { buildSurgery } from "@app/modules/surgeries/tests/factories";
import { describe, expect, it } from "vitest";

const scheduled = buildSurgery({ id: "1", type: "Castración", status: "scheduled" });
const done = buildSurgery({ id: "2", type: "Ovariohisterectomía", status: "done" });

describe("filterSurgeries", () => {
  it("sin query ni filtro devuelve todas", () => {
    expect(filterSurgeries([scheduled, done], "", "all")).toHaveLength(2);
  });

  it("filtra por estado", () => {
    const result = filterSurgeries([scheduled, done], "", "done");
    expect(result).toEqual([done]);
  });

  it("busca por tipo (case-insensitive)", () => {
    expect(filterSurgeries([scheduled, done], "castr", "all")).toEqual([scheduled]);
    expect(filterSurgeries([scheduled, done], "OVARIO", "all")).toEqual([done]);
  });

  it("combina búsqueda y filtro de estado", () => {
    expect(filterSurgeries([scheduled, done], "castr", "done")).toEqual([]);
    expect(filterSurgeries([scheduled, done], "castr", "scheduled")).toEqual([scheduled]);
  });
});
