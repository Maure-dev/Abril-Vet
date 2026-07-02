import type { OptionType } from "@app/modules/main/entities/entities";
import { filterOptions } from "@app/modules/main/helpers/filterOptions";
import { describe, expect, it } from "vitest";

const OPTIONS: OptionType[] = [
  { id: "1", label: "Pérez, Ana", sublabel: "30111222" },
  { id: "2", label: "Gómez, Luis", sublabel: "27333444" },
  { id: "3", label: "Firulais" }
];

describe("filterOptions", () => {
  it("sin query devuelve todas", () => {
    expect(filterOptions(OPTIONS, "")).toHaveLength(3);
    expect(filterOptions(OPTIONS, "   ")).toHaveLength(3);
  });

  it("filtra por label (case-insensitive)", () => {
    expect(filterOptions(OPTIONS, "firu")).toEqual([OPTIONS[2]]);
    expect(filterOptions(OPTIONS, "GÓMEZ")).toEqual([OPTIONS[1]]);
  });

  it("filtra por sublabel", () => {
    expect(filterOptions(OPTIONS, "30111")).toEqual([OPTIONS[0]]);
  });

  it("devuelve vacío si no hay coincidencias", () => {
    expect(filterOptions(OPTIONS, "zzz")).toEqual([]);
  });
});
