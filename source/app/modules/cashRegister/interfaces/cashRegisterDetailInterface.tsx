import {
  CASH_MOVEMENT_TYPE_LABELS,
  CASH_STATUS_LABELS
} from "@app/modules/cashRegister/constants/constants";
import type { CashSessionType } from "@app/modules/cashRegister/entities/entities";
import { formatMoney } from "@app/modules/cashRegister/helpers/computeCash";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";

type Props = {
  session: CashSessionType;
  onEdit: (session: CashSessionType) => void;
  onDelete: (session: CashSessionType) => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

// Muestra fecha y hora legibles de un ISO datetime, o "—" si está vacío.
function formatDateTime(value: string): string {
  if (value.length === 0) {
    return "—";
  }
  return value.replace("T", " ").slice(0, 16);
}

export default function CashRegisterDetailInterface({ session, onEdit, onDelete, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">Sesión de caja</h2>
        <BadgeInterface tone={session.status === "open" ? "success" : "neutral"}>
          {CASH_STATUS_LABELS[session.status]}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(session)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(session)}
            message="¿Seguro que querés eliminar esta sesión de caja? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Arqueo</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Apertura" value={formatDateTime(session.openedAt)} />
          <Row label="Cierre" value={formatDateTime(session.closedAt)} />
          <Row label="Monto de apertura" value={formatMoney(session.openingAmount)} />
          <Row label="Esperado" value={formatMoney(session.expectedAmount)} />
          <Row
            label="Contado"
            value={session.countedAmount === null ? "" : formatMoney(session.countedAmount)}
          />
          <Row
            label="Diferencia"
            value={session.status === "closed" ? formatMoney(session.difference) : ""}
          />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Movimientos</h3>
        {session.movements.length === 0 ? (
          <p className="text-sm text-ink-soft">No hay movimientos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
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
      </CardInterface>

      {session.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Notas</h3>
          <p className="whitespace-pre-line text-sm text-ink">{session.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
