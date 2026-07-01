import { filterPatients } from "@app/modules/patients/helpers/filterPatients";
import { buildPatient } from "@app/modules/patients/tests/factories";
import { describe, expect, it } from "vitest";

const dog = buildPatient({ id: "1", name: "Firulais", species: "dog", breed: "Caniche" });
const cat = buildPatient({
  id: "2",
  name: "Michi",
  species: "cat",
  breed: "Siamés",
  microchip: "111"
});

describe("filterPatients", () => {
  it("sin query ni filtro devuelve todos", () => {
    expect(filterPatients([dog, cat], "", "all")).toHaveLength(2);
  });

  it("filtra por especie", () => {
    const result = filterPatients([dog, cat], "", "cat");
    expect(result).toEqual([cat]);
  });

  it("busca por nombre, raza o microchip (case-insensitive)", () => {
    expect(filterPatients([dog, cat], "firu", "all")).toEqual([dog]);
    expect(filterPatients([dog, cat], "siamés", "all")).toEqual([cat]);
    expect(filterPatients([dog, cat], "111", "all")).toEqual([cat]);
  });
});
