import type { ClientInvoiceType } from "@app/modules/clients/entities/entities";
import { summarizeInvoices } from "@app/modules/clients/helpers/summarizeInvoices";
import { describe, expect, it } from "vitest";

function buildInvoice(overrides: Partial<ClientInvoiceType> = {}): ClientInvoiceType {
  return {
    id: "inv-1",
    date: "2026-07-06",
    total: 1000,
    paidAmount: 1000,
    status: "paid",
    ...overrides
  };
}

describe("summarizeInvoices", () => {
  it("devuelve ceros con una lista vacía", () => {
    expect(summarizeInvoices([])).toEqual({ billed: 0, paid: 0 });
  });

  it("suma lo facturado y lo pagado por separado", () => {
    const invoices = [
      buildInvoice({ total: 1000, paidAmount: 1000 }),
      buildInvoice({ id: "inv-2", total: 500, paidAmount: 200, status: "partial" })
    ];
    expect(summarizeInvoices(invoices)).toEqual({ billed: 1500, paid: 1200 });
  });
});
