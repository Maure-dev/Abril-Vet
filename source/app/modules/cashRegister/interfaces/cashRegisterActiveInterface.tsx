import { CASH_MOVEMENT_TYPE_LABELS } from "@app/modules/cashRegister/constants/constants";
import type {
  CashCloseFormErrorsType,
  CashCloseFormType,
  CashMovementFormErrorsType,
  CashMovementFormType,
  CashMovementTypeType,
  CashSessionType
} from "@app/modules/cashRegister/entities/entities";
import { computeExpectedAmount, formatMoney } from "@app/modules/cashRegister/helpers/computeCash";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  session: CashSessionType;
  movementForm: CashMovementFormType;
  movementErrors: CashMovementFormErrorsType;
  closeForm: CashCloseFormType;
  closeErrors: CashCloseFormErrorsType;
  saving: boolean;
  onChangeMovementField: <K extends keyof CashMovementFormType>(
    field: K,
    value: CashMovementFormType[K]
  ) => void;
  onAddMovement: () => void;
  onChangeCloseField: <K extends keyof CashCloseFormType>(
    field: K,
    value: CashCloseFormType[K]
  ) => void;
  onCloseSession: () => void;
};

const MOVEMENT_TYPE_OPTIONS = Object.keys(CASH_MOVEMENT_TYPE_LABELS) as CashMovementTypeType[];

// Muestra fecha y hora legibles de un ISO datetime.
function formatDateTime(value: string): string {
  if (value.length === 0) {
    return "—";
  }
  return value.replace("T", " ").slice(0, 16);
}

export default function CashRegisterActiveInterface({
  session,
  movementForm,
  movementErrors,
  closeForm,
  closeErrors,
  saving,
  onChangeMovementField,
  onAddMovement,
  onChangeCloseField,
  onCloseSession
}: Props) {
  const expectedAmount = computeExpectedAmount(session.openingAmount, session.movements);

  return (
    <div className="flex flex-col gap-5">
      <CardInterface>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-lg text-brand-fg">Caja abierta</h2>
          <BadgeInterface tone="success">Abierta</BadgeInterface>
          <span className="ml-auto text-sm text-ink-soft">
            Apertura: {formatDateTime(session.openedAt)}
          </span>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Monto de apertura</dt>
            <dd className="text-sm text-ink">{formatMoney(session.openingAmount)}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Movimientos</dt>
            <dd className="text-sm text-ink">{session.movements.length}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">Esperado en caja</dt>
            <dd className="text-sm font-medium text-ink">{formatMoney(expectedAmount)}</dd>
          </div>
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Movimientos</h3>
        {session.movements.length === 0 ? (
          <p className="mb-4 text-sm text-ink-soft">Todavía no registraste movimientos.</p>
        ) : (
          <div className="mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-semibold">Tipo</th>
                  <th className="px-3 py-2 font-semibold">Concepto</th>
                  <th className="px-3 py-2 font-semibold">Monto</th>
                  <th className="px-3 py-2 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {session.movements.map((movement) => (
                  <tr key={movement.at} className="border-b border-line/60 last:border-0">
                    <td className="px-3 py-2">
                      <BadgeInterface tone={movement.type === "income" ? "success" : "warning"}>
                        {CASH_MOVEMENT_TYPE_LABELS[movement.type]}
                      </BadgeInterface>
                    </td>
                    <td className="px-3 py-2 text-ink">{movement.concept || "—"}</td>
                    <td className="px-3 py-2 text-ink-soft">{formatMoney(movement.amount)}</td>
                    <td className="px-3 py-2 text-ink-soft">{formatDateTime(movement.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAddMovement();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <FieldInterface label="Tipo">
              <SelectInterface
                value={movementForm.type}
                onChange={(e) =>
                  onChangeMovementField("type", e.target.value as CashMovementTypeType)
                }
              >
                {MOVEMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {CASH_MOVEMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </SelectInterface>
            </FieldInterface>
            <FieldInterface label="Monto (ARS)" error={movementErrors.amount}>
              <InputInterface
                type="number"
                step="0.01"
                min="0"
                value={movementForm.amount}
                onChange={(e) => onChangeMovementField("amount", e.target.value)}
              />
            </FieldInterface>
            <FieldInterface label="Concepto" error={movementErrors.concept}>
              <InputInterface
                value={movementForm.concept}
                onChange={(e) => onChangeMovementField("concept", e.target.value)}
              />
            </FieldInterface>
          </div>
          <div>
            <ButtonInterface type="submit" variant="secondary" loading={saving}>
              Agregar movimiento
            </ButtonInterface>
          </div>
        </form>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Cerrar caja</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCloseSession();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInterface
              label="Efectivo contado (ARS)"
              error={closeErrors.countedAmount}
              hint="Lo que hay físicamente en la caja"
              required
            >
              <InputInterface
                type="number"
                step="0.01"
                min="0"
                value={closeForm.countedAmount}
                onChange={(e) => onChangeCloseField("countedAmount", e.target.value)}
              />
            </FieldInterface>
          </div>
          <div>
            <ButtonInterface type="submit" variant="success" loading={saving}>
              Cerrar caja
            </ButtonInterface>
          </div>
        </form>
      </CardInterface>
    </div>
  );
}
