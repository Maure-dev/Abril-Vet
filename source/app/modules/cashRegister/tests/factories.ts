import type {
  CashMovementType,
  CashSessionType
} from "@app/modules/cashRegister/entities/entities";

// Factories de datos del módulo caja para tests.

export function buildCashMovement(overrides: Partial<CashMovementType> = {}): CashMovementType {
  return {
    type: "income",
    amount: 1000,
    concept: "Consulta",
    at: "2026-07-01T10:00:00.000Z",
    ...overrides
  };
}

export function buildCashSession(overrides: Partial<CashSessionType> = {}): CashSessionType {
  return {
    id: "cash-1",
    openedAt: "2026-07-01T09:00:00.000Z",
    closedAt: "",
    status: "open",
    openingAmount: 5000,
    countedAmount: null,
    movements: [],
    expectedAmount: 5000,
    difference: 0,
    notes: "",
    ...overrides
  };
}
