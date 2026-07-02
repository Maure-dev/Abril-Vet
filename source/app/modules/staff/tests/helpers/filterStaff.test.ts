import { filterStaff } from "@app/modules/staff/helpers/filterStaff";
import { buildStaff } from "@app/modules/staff/tests/factories";
import { describe, expect, it } from "vitest";

const vet = buildStaff({
  id: "1",
  firstName: "Ana",
  lastName: "Gómez",
  email: "ana.gomez@abrilvet.com",
  roles: ["vet"],
  isActive: true
});
const receptionist = buildStaff({
  id: "2",
  firstName: "Bruno",
  lastName: "Pérez",
  email: "bruno.perez@abrilvet.com",
  roles: ["receptionist"],
  isActive: false
});

describe("filterStaff", () => {
  it("sin query ni filtros devuelve todos", () => {
    expect(filterStaff([vet, receptionist], "", "all", "all")).toHaveLength(2);
  });

  it("filtra por rol", () => {
    expect(filterStaff([vet, receptionist], "", "vet", "all")).toEqual([vet]);
  });

  it("filtra por estado activo/inactivo", () => {
    expect(filterStaff([vet, receptionist], "", "all", "active")).toEqual([vet]);
    expect(filterStaff([vet, receptionist], "", "all", "inactive")).toEqual([receptionist]);
  });

  it("busca por nombre, apellido o email (case-insensitive)", () => {
    expect(filterStaff([vet, receptionist], "ana", "all", "all")).toEqual([vet]);
    expect(filterStaff([vet, receptionist], "pérez", "all", "all")).toEqual([receptionist]);
    expect(filterStaff([vet, receptionist], "BRUNO.PEREZ", "all", "all")).toEqual([receptionist]);
    expect(filterStaff([vet, receptionist], "inexistente", "all", "all")).toEqual([]);
  });

  it("combina búsqueda con filtros de rol y estado", () => {
    expect(filterStaff([vet, receptionist], "o", "vet", "active")).toEqual([vet]);
    expect(filterStaff([vet, receptionist], "o", "vet", "inactive")).toEqual([]);
  });
});
