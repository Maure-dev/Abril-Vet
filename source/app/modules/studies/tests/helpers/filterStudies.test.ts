import { filterStudies } from "@app/modules/studies/helpers/filterStudies";
import { buildStudy } from "@app/modules/studies/tests/factories";
import { describe, expect, it } from "vitest";

const lab = buildStudy({ id: "1", name: "Hemograma completo", type: "lab" });
const ultrasound = buildStudy({ id: "2", name: "Ecografía abdominal", type: "ultrasound" });

describe("filterStudies", () => {
  it("sin query ni filtro devuelve todos", () => {
    expect(filterStudies([lab, ultrasound], "", "all")).toHaveLength(2);
  });

  it("filtra por tipo", () => {
    const result = filterStudies([lab, ultrasound], "", "ultrasound");
    expect(result).toEqual([ultrasound]);
  });

  it("busca por nombre (case-insensitive)", () => {
    expect(filterStudies([lab, ultrasound], "hemograma", "all")).toEqual([lab]);
    expect(filterStudies([lab, ultrasound], "ABDOMINAL", "all")).toEqual([ultrasound]);
  });

  it("combina búsqueda y filtro de tipo", () => {
    expect(filterStudies([lab, ultrasound], "eco", "lab")).toEqual([]);
    expect(filterStudies([lab, ultrasound], "eco", "ultrasound")).toEqual([ultrasound]);
  });
});
