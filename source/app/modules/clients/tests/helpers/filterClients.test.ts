import { filterClients } from "@app/modules/clients/helpers/filterClients";
import { buildClient } from "@app/modules/clients/tests/factories";
import { describe, expect, it } from "vitest";

const active = buildClient({
  id: "1",
  firstName: "Ana",
  lastName: "García",
  docId: "30111222",
  email: "ana@example.com",
  phone: "1145551234",
  isActive: true
});
const inactive = buildClient({
  id: "2",
  firstName: "Bruno",
  lastName: "López",
  docId: "27999888",
  email: "bruno@example.com",
  phone: "1166669999",
  isActive: false
});

describe("filterClients", () => {
  it("sin query ni filtro devuelve todos", () => {
    expect(filterClients([active, inactive], "", "all")).toHaveLength(2);
  });

  it("filtra por estado activo/inactivo", () => {
    expect(filterClients([active, inactive], "", "active")).toEqual([active]);
    expect(filterClients([active, inactive], "", "inactive")).toEqual([inactive]);
  });

  it("busca por nombre, apellido, documento, email y teléfono (case-insensitive)", () => {
    expect(filterClients([active, inactive], "ana", "all")).toEqual([active]);
    expect(filterClients([active, inactive], "lópez", "all")).toEqual([inactive]);
    expect(filterClients([active, inactive], "30111222", "all")).toEqual([active]);
    expect(filterClients([active, inactive], "bruno@example.com", "all")).toEqual([inactive]);
    expect(filterClients([active, inactive], "1145551234", "all")).toEqual([active]);
  });

  it("combina búsqueda y filtro de estado", () => {
    expect(filterClients([active, inactive], "example.com", "inactive")).toEqual([inactive]);
  });
});
