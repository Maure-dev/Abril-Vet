import type { SupplierType } from "@app/modules/suppliers/entities/entities";
import { filterSuppliers } from "@app/modules/suppliers/helpers/filterSuppliers";
import { describe, expect, it } from "vitest";

function buildSupplier(overrides: Partial<SupplierType> = {}): SupplierType {
  return {
    id: "sup-1",
    name: "Distribuidora Norte",
    contactName: "Ana Pérez",
    email: "ventas@norte.com",
    phone: "3510000000",
    address: "Av. Colón 123",
    cuit: "30-11111111-1",
    notes: "",
    isActive: true,
    ...overrides
  };
}

const norte = buildSupplier({ id: "1", name: "Distribuidora Norte" });
const sur = buildSupplier({
  id: "2",
  name: "Insumos Sur",
  email: "hola@sur.com",
  cuit: "30-22222222-2",
  isActive: false
});

describe("filterSuppliers", () => {
  it("sin query ni filtro devuelve todos", () => {
    expect(filterSuppliers([norte, sur], "", "all")).toHaveLength(2);
  });

  it("filtra por estado activo", () => {
    expect(filterSuppliers([norte, sur], "", "active")).toEqual([norte]);
  });

  it("filtra por estado inactivo", () => {
    expect(filterSuppliers([norte, sur], "", "inactive")).toEqual([sur]);
  });

  it("busca por nombre, CUIT o email (case-insensitive)", () => {
    expect(filterSuppliers([norte, sur], "norte", "all")).toEqual([norte]);
    expect(filterSuppliers([norte, sur], "22222222", "all")).toEqual([sur]);
    expect(filterSuppliers([norte, sur], "HOLA@SUR.COM", "all")).toEqual([sur]);
  });
});
