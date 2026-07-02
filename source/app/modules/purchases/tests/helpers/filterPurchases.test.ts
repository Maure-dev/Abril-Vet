import { filterPurchases } from "@app/modules/purchases/helpers/filterPurchases";
import { buildPurchase } from "@app/modules/purchases/tests/factories";
import { describe, expect, it } from "vitest";

const ordered = buildPurchase({
  id: "1",
  supplierId: "Distribuidora Norte",
  invoiceNumber: "A-1001",
  status: "ordered"
});
const received = buildPurchase({
  id: "2",
  supplierId: "Insumos Sur",
  invoiceNumber: "B-2002",
  status: "received"
});

describe("filterPurchases", () => {
  it("sin query ni filtro devuelve todas", () => {
    expect(filterPurchases([ordered, received], "", "all")).toHaveLength(2);
  });

  it("filtra por estado", () => {
    expect(filterPurchases([ordered, received], "", "received")).toEqual([received]);
  });

  it("busca por proveedor o N° de factura (case-insensitive)", () => {
    expect(filterPurchases([ordered, received], "norte", "all")).toEqual([ordered]);
    expect(filterPurchases([ordered, received], "b-2002", "all")).toEqual([received]);
  });
});
