import { filterProducts } from "@app/modules/products/helpers/filterProducts";
import { buildProduct } from "@app/modules/products/tests/factories";
import { describe, expect, it } from "vitest";

const food = buildProduct({
  id: "1",
  code: "AV-100",
  name: "Alimento premium",
  category: "food",
  barcode: "111",
  isActive: true
});
const med = buildProduct({
  id: "2",
  code: "AV-200",
  name: "Antibiótico",
  category: "medication",
  barcode: "222",
  isActive: false
});

describe("filterProducts", () => {
  it("sin query ni filtros devuelve todos", () => {
    expect(filterProducts([food, med], "", "all", "all")).toHaveLength(2);
  });

  it("filtra por categoría", () => {
    expect(filterProducts([food, med], "", "medication", "all")).toEqual([med]);
  });

  it("filtra por estado activo/inactivo", () => {
    expect(filterProducts([food, med], "", "all", "active")).toEqual([food]);
    expect(filterProducts([food, med], "", "all", "inactive")).toEqual([med]);
  });

  it("busca por nombre, código o código de barras (case-insensitive)", () => {
    expect(filterProducts([food, med], "premium", "all", "all")).toEqual([food]);
    expect(filterProducts([food, med], "av-200", "all", "all")).toEqual([med]);
    expect(filterProducts([food, med], "111", "all", "all")).toEqual([food]);
  });
});
